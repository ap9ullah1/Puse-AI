"use client";

import { ProductThumb } from "./ProductThumb";
import { LightboxImage } from "./LightboxImage";

/** Prefer a real product image when seeded; fall back to on-brand gradient tile. */
export function ProductImage({
  id,
  kind,
  name,
  image,
  className = "",
}: {
  id: string;
  kind: "skincare" | "apparel";
  name: string;
  image?: string | null;
  className?: string;
}) {
  if (image) {
    return (
      <LightboxImage src={image} alt={name} className={className}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={name} className={`object-cover ${className}`} />
      </LightboxImage>
    );
  }

  return <ProductThumb id={id} kind={kind} className={className} />;
}
