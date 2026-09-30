"use client";

import { useState } from "react";
import { ImageUploader } from "@/components/ImageUploader";
import { usePolledTask } from "@/lib/use-polled-task";
import type { ApparelProduct } from "@/lib/products";
import type { ClothTryOnPollResponse } from "@/lib/youcam/types";

export function TryOnFlow({ product }: { product: ApparelProduct }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const endpoint = taskId ? `/api/try-on/${taskId}?productId=${encodeURIComponent(product.id)}` : null;
  const { status, data, error } = usePolledTask<ClothTryOnPollResponse>(endpoint);

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

  return (
    <div className="flex flex-col gap-6">
      <p className="text-zinc-600 dark:text-zinc-400">
        Upload a full-body photo, facing forward. YouCam VTO renders {product.name} on you in a few
        seconds.
      </p>

      {!previewUrl && <ImageUploader label="Upload a full-body photo" onUploaded={handleUploaded} />}

      {previewUrl && (
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="flex flex-col items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="Your photo" className="h-80 w-60 rounded-2xl object-cover" />
            <span className="text-xs text-zinc-500">Original</span>
          </div>

          <div className="flex flex-1 flex-col items-center gap-2">
            {(creating || status === "running") && (
              <div className="flex h-80 w-60 items-center justify-center rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700">
                <p className="text-sm text-zinc-500">Rendering…</p>
              </div>
            )}
            {(createError || (status === "error" && error)) && (
              <p className="text-red-600">{createError ?? error}</p>
            )}
            {status === "success" && data?.results && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.results.url}
                  alt={`${product.name} try-on result`}
                  className="h-80 w-60 rounded-2xl object-cover"
                />
                <span className="text-xs text-zinc-500">With {product.name}</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
