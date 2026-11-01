"use client";

import { useState } from "react";
import { Check, Footprints, PersonStanding, RefreshCw, Shirt, SunMedium } from "lucide-react";
import { ImageUploader } from "@/components/ImageUploader";
import { usePolledTask } from "@/lib/use-polled-task";
import { friendlyYouCamError } from "@/lib/youcam/errors";
import { Card } from "@/components/ui/Card";
import { LightboxImage } from "@/components/ui/LightboxImage";
import { SaveResultsBanner } from "@/components/SaveResultsBanner";
import { AddToBagButton } from "@/components/AddToBagButton";
import { Reveal } from "@/components/Reveal";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import type { ApparelProduct } from "@/lib/products";
import type { ClothTryOnPollResponse } from "@/lib/youcam/types";

const GUIDANCE = [
  "Full body, standing, forward-facing",
  "Shoulders and feet both visible",
  "Plain background, even light",
];

const STEPS = [
  { icon: PersonStanding, label: "Photo" },
  { icon: Shirt, label: "Render" },
  { icon: Check, label: "Bag" },
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
  const step = !previewUrl ? 1 : status === "success" && data?.results ? 3 : 2;

  return (
    <div className="flex flex-col gap-6">
      <ol className="grid grid-cols-3 gap-2">
        {STEPS.map((item, index) => {
          const current = index + 1;
          const done = current < step;
          const active = current === step;
          const Icon = item.icon;
          return (
            <li
              key={item.label}
              className={`flex items-center justify-center gap-2 rounded-full border px-3 py-2 text-xs font-medium ${
                active
                  ? "border-accent-solid text-accent-solid"
                  : done
                    ? "border-border text-foreground"
                    : "border-border text-muted-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {item.label}
            </li>
          );
        })}
      </ol>
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <PersonStanding className="h-3.5 w-3.5 text-accent-solid" /> One person
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Footprints className="h-3.5 w-3.5 text-accent-solid" /> Feet in frame
        </span>
        <span className="inline-flex items-center gap-1.5">
          <SunMedium className="h-3.5 w-3.5 text-accent-solid" /> Even light
        </span>
      </div>
      <p className="text-muted-foreground">
        Upload a full-body photo. YouCam Clothes VTO renders {product.name} on you, then you can
        add that look to your bag.
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
                <span className="puse-gradient-bg puse-ring h-3 w-3 rounded-full" />
                <p className="text-sm text-muted-foreground">Rendering…</p>
              </div>
            )}

            {(createError || taskErrorMessage) && (
              <Card className="flex w-60 flex-col gap-3 p-5 text-center">
                <p className="text-sm text-accent-solid">{createError ?? taskErrorMessage}</p>
                <button
                  type="button"
                  onClick={retry}
                  className="inline-flex items-center justify-center gap-1.5 self-center text-sm font-medium text-foreground underline underline-offset-4"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
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
                <Card className="w-full max-w-md border-accent-solid/25 p-4 text-left">
                  <p className="text-sm font-medium">Look saved to your experiences</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    This try-on photo is stored in Looks. Add it to your bag to keep the same image
                    through checkout and on your order.
                  </p>
                  <Link
                    href="/history?case=try-on"
                    className="mt-2 inline-block text-xs font-medium text-accent-solid hover:underline"
                  >
                    Open your looks →
                  </Link>
                </Card>
                <div className="flex w-full max-w-xs flex-col gap-2 pt-2">
                  <AddToBagButton
                    productId={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.image}
                    kind="apparel"
                    category={product.category}
                    vto
                    tryOnUrl={data.results.url}
                    label="Add look to bag"
                    className="w-full"
                  />
                  <Link href="/bag" className={`${buttonVariants("outline", "md")} w-full`}>
                    Checkout bag
                  </Link>
                </div>
                <div className="w-full max-w-md pt-2">
                  <SaveResultsBanner kind="try-on" />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
