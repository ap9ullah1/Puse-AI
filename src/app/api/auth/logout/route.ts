import { NextResponse } from "next/server";
import { authCookieOptions, USER_AUTH_COOKIE } from "@/lib/auth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(USER_AUTH_COOKIE, "", { ...authCookieOptions(0), maxAge: 0 });
  return res;
}
