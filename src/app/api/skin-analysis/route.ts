import { NextResponse } from "next/server";
import { trackEvent } from "@/lib/analytics";
import { createSkinAnalysisTask } from "@/lib/youcam/client";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const fileId =
    typeof body === "object" && body !== null && "fileId" in body
      ? (body as { fileId: unknown }).fileId
      : undefined;

  if (typeof fileId !== "string" || !fileId.trim()) {
    return NextResponse.json({ error: "Missing fileId" }, { status: 400 });
  }

  try {
    const taskId = await createSkinAnalysisTask(fileId);
    void trackEvent({
      request,
      action: "skin_analysis_start",
      path: "/analyze",
      label: "Started Skin AI analysis",
      meta: { taskId },
    });
    return NextResponse.json({ taskId });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not start analysis";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
