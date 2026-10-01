import { NextResponse } from "next/server";
import { runShopAgent } from "@/lib/shop-agent";
import { getCurrentUserId } from "@/lib/auth";
import { readSessionId } from "@/lib/session";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const message =
    typeof body === "object" && body !== null && "message" in body
      ? String((body as { message: unknown }).message ?? "")
      : "";

  if (!message.trim()) {
    return NextResponse.json({ error: "Message required" }, { status: 400 });
  }

  const [sessionId, userId] = await Promise.all([readSessionId(), getCurrentUserId()]);
  const result = await runShopAgent({ message, sessionId, userId });
  return NextResponse.json(result);
}
