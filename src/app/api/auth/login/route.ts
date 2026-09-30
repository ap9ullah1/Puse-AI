import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  authCookieOptions,
  claimSessionResults,
  isValidEmail,
  normalizeEmail,
  signUserToken,
  USER_AUTH_COOKIE,
  verifyPassword,
} from "@/lib/auth";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const emailRaw =
    typeof body === "object" && body !== null && "email" in body
      ? String((body as { email: unknown }).email ?? "")
      : "";
  const password =
    typeof body === "object" && body !== null && "password" in body
      ? String((body as { password: unknown }).password ?? "")
      : "";

  const email = normalizeEmail(emailRaw);
  if (!isValidEmail(email) || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const claimed = await claimSessionResults(user.id);

  const res = NextResponse.json({
    ok: true,
    user: { id: user.id, email: user.email, name: user.name },
    claimed,
  });
  res.cookies.set(USER_AUTH_COOKIE, signUserToken(user.id), authCookieOptions());
  return res;
}
