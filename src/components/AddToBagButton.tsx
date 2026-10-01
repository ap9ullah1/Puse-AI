"use client";

import { useState } from "react";
import { useBag } from "@/lib/bag";
import { buttonVariants } from "@/components/ui/button-variants";

export function AddToBagButton({
  productId,
  name,
  price,
  image,
  kind,
  tryOnUrl,
  label = "Add to bag",
  className = "",
}: {
  productId: string;
  name: string;
  price: number;
  image: string;
  kind: "skincare" | "apparel";
  tryOnUrl?: string;
  label?: string;
  className?: string;
}) {
  const { addItem } = useBag();
  const [added, setAdded] = useState(false);

  function onClick() {
    addItem({ productId, name, price, image, kind, tryOnUrl });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${buttonVariants("primary", "md")} ${className}`}
    >
      {added ? "Added ✓" : label}
    </button>
  );
}
