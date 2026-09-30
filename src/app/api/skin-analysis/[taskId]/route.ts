import { NextResponse } from "next/server";
import { trackEvent } from "@/lib/analytics";
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
      const existing = await prisma.skinAnalysisResult.findUnique({ where: { taskId } });
      await prisma.skinAnalysisResult.upsert({
        where: { taskId },
        create: {
          taskId,
          sessionId,
          concerns: JSON.stringify(data.results.output),
        },
        update: {},
      });
      if (!existing) {
        void trackEvent({
          request: _request,
          action: "skin_analysis_complete",
          path: "/analyze",
          label: "Finished Skin AI analysis",
          sessionId,
          meta: { taskId },
        });
      }
    }

    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not fetch task";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
