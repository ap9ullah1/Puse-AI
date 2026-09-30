import { NextResponse } from "next/server";
import { createSkinAnalysisTask } from "@/lib/youcam/client";

export async function POST(request: Request) {
  const body = await request.json();
  const { fileId } = body;

  if (typeof fileId !== "string") {
    return NextResponse.json({ error: "Missing fileId" }, { status: 400 });
  }

  try {
    const taskId = await createSkinAnalysisTask(fileId);
    return NextResponse.json({ taskId });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not start analysis";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
