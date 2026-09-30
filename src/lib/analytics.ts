import { prisma } from "@/lib/db";
import { getClientIp, lookupGeo } from "@/lib/geo";
import { getOrCreateSessionId } from "@/lib/session";

export type TrackAction =
  | "page_view"
  | "upload"
  | "skin_analysis_start"
  | "skin_analysis_complete"
  | "try_on_start"
  | "try_on_complete";

type TrackInput = {
  request: Request;
  action: TrackAction;
  path?: string;
  label?: string;
  meta?: Record<string, unknown>;
  sessionId?: string;
};

export async function trackEvent(input: TrackInput): Promise<void> {
  try {
    const sessionId = input.sessionId ?? (await getOrCreateSessionId());
    const ip = getClientIp(input.request);
    const geo = await lookupGeo(ip);
    const referer = input.request.headers.get("referer")?.slice(0, 500) ?? null;
    const userAgent = input.request.headers.get("user-agent")?.slice(0, 500) ?? null;

    await prisma.visitEvent.create({
      data: {
        sessionId,
        action: input.action,
        path: input.path?.slice(0, 300) ?? null,
        label: input.label?.slice(0, 300) ?? null,
        ip: geo.ip,
        country: geo.country,
        region: geo.region,
        city: geo.city,
        referer,
        userAgent,
        meta: input.meta ? JSON.stringify(input.meta) : null,
      },
    });
  } catch (err) {
    console.error("[analytics] track failed", err);
  }
}

export function shortSession(sessionId: string): string {
  return sessionId.slice(0, 8);
}

export function actionLabel(action: string): string {
  switch (action) {
    case "page_view":
      return "Opened page";
    case "upload":
      return "Uploaded a photo";
    case "skin_analysis_start":
      return "Started Skin AI";
    case "skin_analysis_complete":
      return "Finished Skin AI";
    case "try_on_start":
      return "Started virtual try-on";
    case "try_on_complete":
      return "Finished virtual try-on";
    default:
      return action.replace(/_/g, " ");
  }
}
