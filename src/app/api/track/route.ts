import { NextResponse } from "next/server";
import { trackEvent, type TrackAction } from "@/lib/analytics";

const ALLOWED = new Set<TrackAction>([
  "page_view",
  "upload",
  "skin_analysis_start",
  "skin_analysis_complete",
  "try_on_start",
  "try_on_complete",
]);

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const action =
    typeof body === "object" && body !== null && "action" in body
      ? (body as { action: unknown }).action
      : undefined;
  const path =
    typeof body === "object" && body !== null && "path" in body
      ? (body as { path: unknown }).path
      : undefined;
  const label =
    typeof body === "object" && body !== null && "label" in body
      ? (body as { label: unknown }).label
      : undefined;

  if (typeof action !== "string" || !ALLOWED.has(action as TrackAction)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  // Skip noisy self-tracking of the dashboard
  if (typeof path === "string" && (path.startsWith("/dashboard") || path.startsWith("/owner/"))) {
    return NextResponse.json({ ok: true });
  }

  await trackEvent({
    request,
    action: action as TrackAction,
    path: typeof path === "string" ? path : undefined,
    label: typeof label === "string" ? label : undefined,
  });

  return NextResponse.json({ ok: true });
}
