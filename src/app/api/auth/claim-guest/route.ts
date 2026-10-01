import { NextResponse } from "next/server";
import { claimSessionResults, getCurrentUserId } from "@/lib/auth";

export async function POST() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const claimed = await claimSessionResults(userId);
  return NextResponse.json({ ok: true, claimed });
}
