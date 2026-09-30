import { NextResponse } from "next/server";
import { OWNER_AUTH_COOKIE, OWNER_DASHBOARD_PATH } from "@/lib/dashboard-auth";

export async function POST() {
  const res = NextResponse.json({ ok: true, redirect: OWNER_DASHBOARD_PATH });
  res.cookies.set(OWNER_AUTH_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res;
}
