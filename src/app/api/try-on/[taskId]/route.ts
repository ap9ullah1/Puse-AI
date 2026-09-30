import { NextResponse } from "next/server";
import { trackEvent } from "@/lib/analytics";
import { getClothTryOnTask } from "@/lib/youcam/client";
import { prisma } from "@/lib/db";
import { getOrCreateSessionId } from "@/lib/session";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params;
  const productId = new URL(request.url).searchParams.get("productId");

  try {
    const data = await getClothTryOnTask(taskId);

    if (data.task_status === "success" && data.results && productId) {
      const sessionId = await getOrCreateSessionId();
      const existing = await prisma.tryOnResult.findUnique({ where: { taskId } });
      await prisma.tryOnResult.upsert({
        where: { taskId },
        create: {
          taskId,
          sessionId,
          productId,
          resultUrl: data.results.url,
        },
        update: { resultUrl: data.results.url },
      });
      if (!existing) {
        void trackEvent({
          request,
          action: "try_on_complete",
          path: `/try-on/${productId}`,
          label: `Finished try-on: ${productId}`,
          sessionId,
          meta: { taskId, productId },
        });
      }
    }

    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not fetch task";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
