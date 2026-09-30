import { NextResponse } from "next/server";
import { trackEvent } from "@/lib/analytics";
import { getCurrentUserId } from "@/lib/auth";
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
      const userId = await getCurrentUserId();
      const existing = await prisma.tryOnResult.findUnique({ where: { taskId } });
      await prisma.tryOnResult.upsert({
        where: { taskId },
        create: {
          taskId,
          sessionId,
          userId: userId ?? undefined,
          productId,
          resultUrl: data.results.url,
        },
        update: {
          resultUrl: data.results.url,
          ...(userId && !existing?.userId ? { userId } : {}),
        },
      });
      if (!existing) {
        void trackEvent({
          request,
          action: "try_on_complete",
          path: `/try-on/${productId}`,
          label: `Finished try-on: ${productId}`,
          sessionId,
          meta: { taskId, productId, userId },
        });
      }
    }

    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not fetch task";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
