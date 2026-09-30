import { NextResponse } from "next/server";
import { getSkinAnalysisTask } from "@/lib/youcam/client";
import { prisma } from "@/lib/db";
import { getOrCreateSessionId } from "@/lib/session";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params;

  try {
    const data = await getSkinAnalysisTask(taskId);

    if (data.task_status === "success" && data.results) {
      const sessionId = await getOrCreateSessionId();
      await prisma.skinAnalysisResult.upsert({
        where: { taskId },
        create: {
          taskId,
          sessionId,
          concerns: JSON.stringify(data.results.output),
        },
        update: {},
      });
    }

    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not fetch task";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
