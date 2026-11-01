"use client";

import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { useBag } from "@/lib/bag";
import { defaultSize } from "@/lib/commerce";
import { buttonVariants } from "@/components/ui/button-variants";

export function AddToBagButton({
  productId,
  name,
  price,
  image,
  kind,
  category,
  tryOnUrl,
  vto,
  size,
  qty = 1,
  stock,
  label = "Add to bag",
  className = "",
}: {
  productId: string;
  name: string;
  price: number;
  image: string;
  kind: "skincare" | "apparel" | "accessory";
  category?: string;
  tryOnUrl?: string;
  vto?: boolean;
  size?: string;
  qty?: number;
  stock?: number;
  label?: string;
  className?: string;
}) {
  const { addItem } = useBag();
  const [added, setAdded] = useState(false);
  const soldOut = stock != null && stock < 1;

  function onClick() {
    if (soldOut) return;
    addItem({
      productId,
      name,
      price,
      image,
      kind,
      category,
      tryOnUrl,
      vto,
      qty,
      size: size ?? defaultSize(kind, category ?? ""),
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={soldOut}
      className={`${buttonVariants("primary", "md")} ${className}`}
    >
      {soldOut ? (
        "Out of stock"
      ) : added ? (
        <>
          <Check className="h-4 w-4" />
          Added
        </>
      ) : (
        <>
          <ShoppingBag className="h-4 w-4" />
          {label}
        </>
      )}
    </button>
  );
}
