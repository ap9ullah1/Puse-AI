"use client";

import { useMemo, useState } from "react";
import { ImageUploader } from "@/components/ImageUploader";
import { usePolledTask } from "@/lib/use-polled-task";
import type { SkincareProduct } from "@/lib/products";
import type { SkinAnalysisPollResponse } from "@/lib/youcam/types";

export function AnalyzeFlow({ skincareProducts }: { skincareProducts: SkincareProduct[] }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const endpoint = taskId ? `/api/skin-analysis/${taskId}` : null;
  const { status, data, error } = usePolledTask<SkinAnalysisPollResponse>(endpoint);

  async function handleUploaded(fileId: string, preview: string) {
    setPreviewUrl(preview);
    setCreating(true);
    setCreateError(null);
    try {
      const res = await fetch("/api/skin-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Could not start analysis");
      setTaskId(body.taskId);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Could not start analysis");
    } finally {
      setCreating(false);
    }
  }

  const topConcerns = useMemo(() => {
    if (!data?.results) return [];
    return [...data.results.output].sort((a, b) => a.ui_score - b.ui_score).slice(0, 3);
  }, [data]);

  const recommended = useMemo(() => {
    const concernTypes = new Set(topConcerns.map((c) => c.type));
    return skincareProducts.filter((p) => concernTypes.has(p.concern));
  }, [topConcerns, skincareProducts]);

  return (
    <>
      {!previewUrl && <ImageUploader label="Upload a selfie" onUploaded={handleUploaded} />}

      {previewUrl && (
        <div className="flex flex-col gap-6 sm:flex-row">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="Uploaded selfie" className="h-64 w-64 rounded-2xl object-cover" />
          <div className="flex-1">
            {(creating || status === "running") && <p>Analyzing your skin…</p>}
            {(createError || (status === "error" && error)) && (
              <p className="text-red-600">{createError ?? error}</p>
            )}
            {status === "success" && data?.results && (
              <div className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold">Top concerns</h2>
                <ul className="flex flex-col gap-2">
                  {topConcerns.map((concern) => (
                    <li
                      key={concern.type}
                      className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-2 dark:border-zinc-800"
                    >
                      <span className="capitalize">{concern.type.replace(/_/g, " ")}</span>
                      <span className="font-mono text-sm text-zinc-500">{concern.ui_score}/100</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {recommended.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold">Recommended for you</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {recommended.map((product) => (
              <div key={product.id} className="rounded-xl border border-zinc-200 p-3 dark:border-zinc-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="mb-2 h-32 w-full rounded-lg object-cover"
                />
                <p className="text-sm font-medium">{product.name}</p>
                <p className="text-sm text-zinc-500">${product.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
