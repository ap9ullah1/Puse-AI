"use client";

import { useMemo, useState } from "react";
import { ImageUploader } from "@/components/ImageUploader";
import { usePolledTask } from "@/lib/use-polled-task";
import { friendlyYouCamError } from "@/lib/youcam/errors";
import { Card } from "@/components/ui/Card";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { ProductThumb } from "@/components/ui/ProductThumb";
import { Reveal } from "@/components/Reveal";
import type { SkincareProduct } from "@/lib/products";
import type { SkinAnalysisPollResponse } from "@/lib/youcam/types";

const GUIDANCE = [
  "Face fills most of the frame",
  "Look straight at the camera",
  "Good, even lighting",
];

export function AnalyzeFlow({ skincareProducts }: { skincareProducts: SkincareProduct[] }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const endpoint = taskId ? `/api/skin-analysis/${taskId}` : null;
  const { status, data } = usePolledTask<SkinAnalysisPollResponse>(endpoint);

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

  function retry() {
    setPreviewUrl(null);
    setTaskId(null);
    setCreateError(null);
  }

  const sortedConcerns = useMemo(() => {
    if (!data?.results) return [];
    return [...data.results.output].sort((a, b) => a.ui_score - b.ui_score);
  }, [data]);

  const topConcerns = sortedConcerns.slice(0, 3);

  const recommended = useMemo(() => {
    const concernTypes = new Set(topConcerns.map((c) => c.type));
    return skincareProducts.filter((p) => concernTypes.has(p.concern));
  }, [topConcerns, skincareProducts]);

  const taskErrorMessage =
    status === "error" ? friendlyYouCamError(data?.error, data?.error_message) : null;

  return (
    <>
      {!previewUrl && (
        <Reveal className="mx-auto w-full max-w-xl">
          <ImageUploader label="Upload a selfie" guidance={GUIDANCE} onUploaded={handleUploaded} />
        </Reveal>
      )}

      {previewUrl && (
        <div className="flex flex-col gap-8 sm:flex-row">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Uploaded selfie"
            className="h-72 w-72 shrink-0 rounded-[var(--radius)] object-cover shadow-[var(--shadow-soft)]"
          />
          <div className="flex-1">
            {(creating || status === "running") && (
              <div className="flex items-center gap-3 text-muted-foreground">
                <span className="pulse-gradient-bg pulse-ring h-2.5 w-2.5 rounded-full" />
                Analyzing your skin…
              </div>
            )}

            {(createError || taskErrorMessage) && (
              <Card className="flex flex-col gap-3 p-5">
                <p className="text-sm text-accent-solid">{createError ?? taskErrorMessage}</p>
                <button
                  type="button"
                  onClick={retry}
                  className="self-start text-sm font-medium text-foreground underline underline-offset-4"
                >
                  Try another photo
                </button>
              </Card>
            )}

            {status === "success" && data?.results && (
              <div className="flex flex-col gap-5">
                <h2 className="font-display text-2xl italic">Top concerns</h2>
                <div className="flex flex-wrap gap-6">
                  {topConcerns.map((concern) => (
                    <ScoreRing key={concern.type} score={concern.ui_score} label={concern.type.replace(/_/g, " ")} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {recommended.length > 0 && (
        <Reveal>
          <h2 className="mb-4 font-display text-2xl italic">Recommended for you</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {recommended.map((product) => (
              <Card key={product.id} className="overflow-hidden p-3">
                <ProductThumb
                  id={product.id}
                  kind="skincare"
                  className="mb-2 h-32 w-full rounded-[calc(var(--radius)-0.4rem)]"
                />
                <p className="text-sm font-medium">{product.name}</p>
                <p className="text-sm text-muted-foreground">${product.price}</p>
              </Card>
            ))}
          </div>
        </Reveal>
      )}
    </>
  );
}
