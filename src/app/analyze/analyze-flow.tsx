"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ImageUploader } from "@/components/ImageUploader";
import { usePolledTask } from "@/lib/use-polled-task";
import { friendlyYouCamError } from "@/lib/youcam/errors";
import { Card } from "@/components/ui/Card";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { ProductImage } from "@/components/ui/ProductImage";
import { LightboxImage } from "@/components/ui/LightboxImage";
import { SaveResultsBanner } from "@/components/SaveResultsBanner";
import { AddToBagButton } from "@/components/AddToBagButton";
import { Reveal } from "@/components/Reveal";
import { buttonVariants } from "@/components/ui/button-variants";
import type { SkincareProduct } from "@/lib/products";
import type { SkinAnalysisPollResponse } from "@/lib/youcam/types";

const GUIDANCE = [
  "Face fills most of the frame",
  "Look straight at the camera",
  "Good, even lighting — JPEG or PNG only",
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
    setTaskId(null);
    setCreating(true);
    setCreateError(null);
    try {
      const res = await fetch("/api/skin-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(
          friendlyYouCamError(null, body?.error ?? "Could not start analysis")
        );
      }
      if (typeof body?.taskId !== "string") {
        throw new Error("Analysis started but no task id came back. Try again.");
      }
      setTaskId(body.taskId);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Could not start analysis");
    } finally {
      setCreating(false);
    }
  }

  function retry() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setTaskId(null);
    setCreateError(null);
  }

  const sortedConcerns = useMemo(() => {
    if (!data?.results?.output?.length) return [];
    return [...data.results.output].sort((a, b) => a.ui_score - b.ui_score);
  }, [data]);

  const topConcerns = sortedConcerns.slice(0, 3);

  const recommended = useMemo(() => {
    const concernTypes = new Set(topConcerns.map((c) => c.type));
    return skincareProducts.filter((p) => concernTypes.has(p.concern));
  }, [topConcerns, skincareProducts]);

  const taskErrorMessage =
    status === "error" ? friendlyYouCamError(data?.error, data?.error_message ?? data?.error) : null;

  const showResults = status === "success" && sortedConcerns.length > 0;

  return (
    <>
      {!previewUrl && (
        <Reveal className="mx-auto w-full max-w-xl">
          <ImageUploader label="Upload a selfie" guidance={GUIDANCE} onUploaded={handleUploaded} />
        </Reveal>
      )}

      {previewUrl && (
        <div className="flex flex-col gap-8 sm:flex-row">
          <LightboxImage
            src={previewUrl}
            alt="Uploaded selfie"
            className="h-72 w-72 shrink-0 rounded-[var(--radius)] shadow-[var(--shadow-soft)] ring-1 ring-accent-solid/20"
          />
          <div className="flex-1">
            {(creating || (taskId && status === "running")) && (
              <div className="flex items-center gap-3 text-muted-foreground">
                <span className="pulse-gradient-bg pulse-ring h-2.5 w-2.5 rounded-full" />
                Analyzing your skin…
              </div>
            )}

            {(createError || taskErrorMessage) && (
              <Card className="flex flex-col gap-3 border-amber-500/30 p-5">
                <p className="text-sm text-amber-400">{createError ?? taskErrorMessage}</p>
                <button
                  type="button"
                  onClick={retry}
                  className="self-start text-sm font-medium text-accent-solid underline underline-offset-4"
                >
                  Try another photo
                </button>
              </Card>
            )}

            {status === "success" && !sortedConcerns.length && (
              <Card className="flex flex-col gap-3 border-amber-500/30 p-5">
                <p className="text-sm text-amber-400">
                  Analysis finished but no scores came back. Try another clear selfie.
                </p>
                <button
                  type="button"
                  onClick={retry}
                  className="self-start text-sm font-medium text-accent-solid underline underline-offset-4"
                >
                  Try another photo
                </button>
              </Card>
            )}

            {showResults && (
              <div className="flex flex-col gap-5">
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-accent-solid">
                    Priority concerns
                  </p>
                  <h2 className="font-display text-2xl font-semibold tracking-tight">
                    Weakest scores
                  </h2>
                </div>
                <div className="flex flex-wrap gap-6 rounded-[var(--radius)] border border-border bg-card/60 p-6">
                  {topConcerns.map((concern) => (
                    <ScoreRing
                      key={concern.type}
                      score={concern.ui_score}
                      label={concern.type.replace(/_/g, " ")}
                    />
                  ))}
                </div>
                <SaveResultsBanner kind="skin" />
              </div>
            )}
          </div>
        </div>
      )}

      {showResults && (
        <Reveal>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-accent-solid">
            Full diagnostic
          </p>
          <h2 className="mb-4 font-display text-2xl font-semibold tracking-tight">
            All {sortedConcerns.length} Skin AI scores
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {sortedConcerns.map((concern) => (
              <Card key={concern.type} className="p-4">
                <p className="text-xs capitalize text-muted-foreground">
                  {concern.type.replace(/_/g, " ")}
                </p>
                <p className="mt-1 font-display text-2xl font-semibold text-accent-solid">
                  {Math.round(concern.ui_score)}
                </p>
              </Card>
            ))}
          </div>
        </Reveal>
      )}

      {recommended.length > 0 && (
        <Reveal>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-accent-solid">
            Matched for you
          </p>
          <h2 className="mb-2 font-display text-2xl font-semibold tracking-tight">
            Recommended products
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Add matches to your bag — same shop path as Novagate-style diagnose → buy.
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {recommended.map((product) => (
              <Card
                key={product.id}
                className="flex flex-col overflow-hidden p-3 transition hover:border-accent-solid/40 hover:shadow-[0_0_24px_-12px_var(--accent-solid)]"
              >
                <ProductImage
                  id={product.id}
                  kind="skincare"
                  name={product.name}
                  image={product.image}
                  className="mb-2 h-32 w-full rounded-[calc(var(--radius)-0.4rem)]"
                />
                <p className="text-sm font-medium">{product.name}</p>
                <p className="text-sm text-muted-foreground">${product.price}</p>
                <p className="mb-3 text-xs capitalize text-muted-foreground">
                  For {product.concern}
                </p>
                <div className="mt-auto flex flex-col gap-2">
                  <AddToBagButton
                    productId={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.image}
                    kind="skincare"
                    className="w-full"
                  />
                  <Link
                    href={`/shop/${product.id}`}
                    className={`${buttonVariants("ghost", "md")} w-full`}
                  >
                    View product
                  </Link>
                </div>
              </Card>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/bag" className={buttonVariants("outline", "md")}>
              Go to bag →
            </Link>
          </div>
        </Reveal>
      )}
    </>
  );
}
