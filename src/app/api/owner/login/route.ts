import { NextResponse } from "next/server";
import {
  OWNER_AUTH_COOKIE,
  OWNER_DASHBOARD_PATH,
  dashboardConfigured,
  signOwnerToken,
  verifyDashboardLogin,
} from "@/lib/dashboard-auth";

export async function POST(request: Request) {
  if (!dashboardConfigured()) {
    return NextResponse.json({ error: "Dashboard auth is not configured" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const username =
    typeof body === "object" && body !== null && "username" in body
      ? String((body as { username: unknown }).username ?? "")
      : "";
  const password =
    typeof body === "object" && body !== null && "password" in body
      ? String((body as { password: unknown }).password ?? "")
      : "";

  if (!verifyDashboardLogin(username, password)) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true, redirect: OWNER_DASHBOARD_PATH });
  res.cookies.set(OWNER_AUTH_COOKIE, signOwnerToken(username), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  return res;
}
