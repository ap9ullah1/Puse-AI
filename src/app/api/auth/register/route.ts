import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  authCookieOptions,
  hashPassword,
  isValidEmail,
  normalizeEmail,
  signUserToken,
  USER_AUTH_COOKIE,
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
  const nameRaw =
    typeof body === "object" && body !== null && "name" in body
      ? String((body as { name: unknown }).name ?? "")
      : "";

  const email = normalizeEmail(emailRaw);
  const name = nameRaw.trim() || null;

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email" }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "An account with that email already exists" }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash: hashPassword(password),
    },
    select: { id: true, email: true, name: true },
  });

  // New accounts start empty — guest browser history is imported only via explicit claim.
  const res = NextResponse.json({
    ok: true,
    user,
    claimed: 0,
  });
  res.cookies.set(USER_AUTH_COOKIE, signUserToken(user.id), authCookieOptions());
  return res;
}
