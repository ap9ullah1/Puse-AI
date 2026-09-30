import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { readSessionId } from "@/lib/session";

export const USER_AUTH_COOKIE = "puse_user_auth";

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
};

function authSecret(): string {
  return (
    process.env.AUTH_SECRET ??
    process.env.DASHBOARD_SECRET ??
    process.env.DASHBOARD_PASS ??
    "puse-dev-auth-secret"
  );
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const next = scryptSync(password, salt, 64).toString("hex");
  try {
    return timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(next, "hex"));
  } catch {
    return false;
  }
}

export function signUserToken(userId: string): string {
  const exp = Date.now() + 1000 * 60 * 60 * 24 * 30;
  const payload = `${userId}.${exp}`;
  const sig = createHmac("sha256", authSecret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifyUserToken(token: string | undefined | null): string | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [userId, expStr, sig] = parts;
  const exp = Number(expStr);
  if (!userId || !sig || !Number.isFinite(exp) || exp < Date.now()) return null;

  const payload = `${userId}.${expStr}`;
  const expected = createHmac("sha256", authSecret()).update(payload).digest("hex");
  try {
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  } catch {
    return null;
  }
  return userId;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const store = await cookies();
  const userId = verifyUserToken(store.get(USER_AUTH_COOKIE)?.value);
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, createdAt: true },
  });
  return user;
}

export async function getCurrentUserId(): Promise<string | null> {
  const user = await getCurrentUser();
  return user?.id ?? null;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Attach anonymous session results to a newly signed-in account. */
export async function claimSessionResults(userId: string): Promise<number> {
  const sessionId = await readSessionId();
  if (!sessionId) return 0;

  const [skin, tryOns] = await Promise.all([
    prisma.skinAnalysisResult.updateMany({
      where: { sessionId, userId: null },
      data: { userId },
    }),
    prisma.tryOnResult.updateMany({
      where: { sessionId, userId: null },
      data: { userId },
    }),
  ]);

  return skin.count + tryOns.count;
}

export function authCookieOptions(maxAgeSeconds = 60 * 60 * 24 * 30) {
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSeconds,
  };
}
