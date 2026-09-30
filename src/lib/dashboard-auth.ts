import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const OWNER_DASHBOARD_PATH = "/owner/nx-ops-562c84";
export const OWNER_AUTH_COOKIE = "puse_owner_auth";

function creds() {
  return {
    user: process.env.DASHBOARD_USER ?? "",
    pass: process.env.DASHBOARD_PASS ?? "",
    secret: process.env.DASHBOARD_SECRET ?? process.env.DASHBOARD_PASS ?? "puse-dev-secret",
  };
}

export function dashboardConfigured(): boolean {
  const { user, pass } = creds();
  return Boolean(user && pass);
}

export function verifyDashboardLogin(username: string, password: string): boolean {
  const { user, pass } = creds();
  if (!user || !pass) return false;
  const uOk = timingSafeEqualString(username, user);
  const pOk = timingSafeEqualString(password, pass);
  return uOk && pOk;
}

function timingSafeEqualString(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // still compare to keep timing flatter
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

export function signOwnerToken(username: string): string {
  const { secret } = creds();
  const exp = Date.now() + 1000 * 60 * 60 * 24 * 14;
  const payload = `${username}.${exp}`;
  const sig = createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifyOwnerToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [username, expStr, sig] = parts;
  const exp = Number(expStr);
  if (!username || !sig || !Number.isFinite(exp) || exp < Date.now()) return false;

  const { user, secret } = creds();
  if (username !== user) return false;

  const payload = `${username}.${expStr}`;
  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function isOwnerAuthenticated(): Promise<boolean> {
  if (!dashboardConfigured()) return false;
  const store = await cookies();
  return verifyOwnerToken(store.get(OWNER_AUTH_COOKIE)?.value);
}
