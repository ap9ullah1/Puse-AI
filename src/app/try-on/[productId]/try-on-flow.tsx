"use client";

import { useState } from "react";
import { ImageUploader } from "@/components/ImageUploader";
import { usePolledTask } from "@/lib/use-polled-task";
import { friendlyYouCamError } from "@/lib/youcam/errors";
import { Card } from "@/components/ui/Card";
import { LightboxImage } from "@/components/ui/LightboxImage";
import { Reveal } from "@/components/Reveal";
import type { ApparelProduct } from "@/lib/products";
import type { ClothTryOnPollResponse } from "@/lib/youcam/types";

const GUIDANCE = [
  "Full body, standing, forward-facing",
  "Shoulders and feet both visible",
  "Plain background works best",
];

export function TryOnFlow({ product }: { product: ApparelProduct }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const endpoint = taskId ? `/api/try-on/${taskId}?productId=${encodeURIComponent(product.id)}` : null;
  const { status, data } = usePolledTask<ClothTryOnPollResponse>(endpoint);

  async function handleUploaded(fileId: string, preview: string) {
    setPreviewUrl(preview);
    setCreating(true);
    setCreateError(null);
    try {
      const res = await fetch("/api/try-on", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId, productId: product.id }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Could not start try-on");
      setTaskId(body.taskId);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Could not start try-on");
    } finally {
      setCreating(false);
    }
  }

  function retry() {
    setPreviewUrl(null);
    setTaskId(null);
    setCreateError(null);
  }

  const taskErrorMessage =
    status === "error" ? friendlyYouCamError(data?.error, data?.error_message) : null;

  return (
    <div className="flex flex-col gap-6">
      <p className="text-muted-foreground">
        Upload a full-body photo and YouCam VTO renders {product.name} on you in a few seconds.
      </p>

      {!previewUrl && (
        <Reveal className="mx-auto w-full max-w-xl">
          <ImageUploader label="Upload a full-body photo" guidance={GUIDANCE} onUploaded={handleUploaded} />
        </Reveal>
      )}

      {previewUrl && (
        <div className="mx-auto flex w-full max-w-2xl flex-col justify-center gap-10 sm:flex-row">
          <div className="flex flex-col items-center gap-2">
            <LightboxImage
              src={previewUrl}
              alt="Your photo"
              className="h-80 w-60 rounded-[var(--radius)] shadow-[var(--shadow-soft)]"
            />
            <span className="text-xs text-muted-foreground">Original</span>
          </div>

          <div className="flex flex-1 flex-col items-center gap-3">
            {(creating || status === "running") && (
              <div className="flex h-80 w-60 flex-col items-center justify-center gap-3 rounded-[var(--radius)] border border-dashed border-border">
                <span className="pulse-gradient-bg pulse-ring h-3 w-3 rounded-full" />
                <p className="text-sm text-muted-foreground">Rendering…</p>
              </div>
            )}

            {(createError || taskErrorMessage) && (
              <Card className="flex w-60 flex-col gap-3 p-5 text-center">
                <p className="text-sm text-accent-solid">{createError ?? taskErrorMessage}</p>
                <button
                  type="button"
                  onClick={retry}
                  className="self-center text-sm font-medium text-foreground underline underline-offset-4"
                >
                  Try another photo
                </button>
              </Card>
            )}

            {status === "success" && data?.results && (
              <>
                <LightboxImage
                  src={data.results.url}
                  alt={`${product.name} try-on result`}
                  className="h-80 w-60 rounded-[var(--radius)] shadow-[var(--shadow-soft)]"
                />
                <span className="text-xs text-muted-foreground">With {product.name}</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
