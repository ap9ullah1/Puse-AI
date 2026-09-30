import type {
  ClothTryOnPollResponse,
  SkinAnalysisPollResponse,
  YouCamFileUploadResponse,
  YouCamTaskCreateResponse,
} from "./types";

const YOUCAM_API_BASE = "https://yce-api-01.makeupar.com";

function requireApiKey(): string {
  const key = process.env.YOUCAM_API_KEY;
  if (!key) {
    throw new Error("YOUCAM_API_KEY is not set");
  }
  return key;
}

async function youcamFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${YOUCAM_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${requireApiKey()}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    const message = body?.error ?? `YouCam API request failed with status ${res.status}`;
    throw new Error(message);
  }

  return body as T;
}

export async function uploadImage(
  buffer: Buffer,
  contentType: string,
  fileName: string
): Promise<string> {
  const initRes = await youcamFetch<YouCamFileUploadResponse>("/s2s/v2.0/file", {
    method: "POST",
    body: JSON.stringify({
      files: [{ content_type: contentType, file_name: fileName, file_size: buffer.byteLength }],
    }),
  });

  const file = initRes.data.files[0];
  const uploadRequest = file.requests[0];

  const uploadRes = await fetch(uploadRequest.url, {
    method: uploadRequest.method,
    headers: uploadRequest.headers,
    body: new Blob([new Uint8Array(buffer)]),
  });

  if (!uploadRes.ok) {
    throw new Error(`YouCam file upload failed with status ${uploadRes.status}`);
  }

  return file.file_id;
}

export const SKIN_CONCERNS = [
  "wrinkle",
  "pore",
  "texture",
  "acne",
  "redness",
  "oiliness",
  "moisture",
  "radiance",
] as const;

export async function createSkinAnalysisTask(fileId: string): Promise<string> {
  const res = await youcamFetch<YouCamTaskCreateResponse>("/s2s/v2.0/task/skin-analysis", {
    method: "POST",
    body: JSON.stringify({
      src_file_id: fileId,
      dst_actions: SKIN_CONCERNS,
      format: "json",
    }),
  });

  return res.data.task_id;
}

export async function getSkinAnalysisTask(taskId: string): Promise<SkinAnalysisPollResponse> {
  const res = await youcamFetch<{ status: number; data: SkinAnalysisPollResponse }>(
    `/s2s/v2.0/task/skin-analysis/${taskId}`
  );
  return res.data;
}

export type GarmentCategory = "auto" | "full_body" | "upper_body" | "lower_body" | "shoes" | "outerwear";

export async function createClothTryOnTask(params: {
  srcFileId: string;
  refImageUrl: string;
  garmentCategory: GarmentCategory;
}): Promise<string> {
  const res = await youcamFetch<YouCamTaskCreateResponse>("/s2s/v2.0/task/cloth-v4", {
    method: "POST",
    body: JSON.stringify({
      src_file_id: params.srcFileId,
      ref_file_url: params.refImageUrl,
      garment_category: params.garmentCategory,
    }),
  });

  return res.data.task_id;
}

export async function getClothTryOnTask(taskId: string): Promise<ClothTryOnPollResponse> {
  const res = await youcamFetch<{ status: number; data: ClothTryOnPollResponse }>(
    `/s2s/v2.0/task/cloth-v4/${taskId}`
  );
  return res.data;
}
