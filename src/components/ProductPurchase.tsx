"use client";

import { useState } from "react";
import Link from "next/link";
import { ScanFace, Shirt } from "lucide-react";
import { AddToBagButton } from "@/components/AddToBagButton";
import { QtyStepper } from "@/components/QtyStepper";
import { TrustRow } from "@/components/TrustRow";
import { buttonVariants } from "@/components/ui/button-variants";
import { requiredSizes } from "@/lib/commerce";

export function ProductPurchase({
  product,
  tryOn,
}: {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    kind: "skincare" | "apparel" | "accessory";
    category: string;
    stock: number;
  };
  tryOn: boolean;
}) {
  const sizes = requiredSizes(product.kind, product.category);
  const [size, setSize] = useState(sizes?.includes("M") ? "M" : (sizes?.[0] ?? ""));
  const [qty, setQty] = useState(1);
  const soldOut = product.stock < 1;
  const maxQty = Math.min(9, Math.max(1, product.stock));

  return (
    <div className="flex flex-col gap-5">
      <p className="text-xs text-muted-foreground">
        {soldOut
          ? "Sold out"
          : product.stock <= 5
            ? `Only ${product.stock} left`
            : "In stock — ships in 1–2 days"}
      </p>

      {sizes && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Size
          </p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((option) => {
              const active = option === size;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSize(option)}
                  className={`min-w-11 rounded-full border px-3 py-2 text-sm transition ${
                    active
                      ? "border-accent-solid bg-accent-solid/10 text-accent-solid"
                      : "border-border text-muted-foreground hover:border-accent-solid/40 hover:text-foreground"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <QtyStepper qty={qty} max={maxQty} onChange={setQty} />
        <p className="text-sm text-muted-foreground">${product.price * qty}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <AddToBagButton
          productId={product.id}
          name={product.name}
          price={product.price}
          image={product.image}
          kind={product.kind}
          category={product.category}
          vto={tryOn}
          size={sizes ? size : undefined}
          qty={qty}
          stock={product.stock}
        />
        {tryOn ? (
          <Link href={`/try-on/${product.id}`} className={buttonVariants("outline", "md")}>
            <Shirt className="h-4 w-4" />
            Virtual try-on
          </Link>
        ) : product.kind === "skincare" ? (
          <Link href="/analyze" className={buttonVariants("outline", "md")}>
            <ScanFace className="h-4 w-4" />
            Analyze my skin
          </Link>
        ) : null}
      </div>

      <TrustRow compact />
    </div>
  );
}
