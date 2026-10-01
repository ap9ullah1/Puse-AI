"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useBag } from "@/lib/bag";
import { Card } from "@/components/ui/Card";
import { buttonVariants } from "@/components/ui/button-variants";
import { LightboxImage } from "@/components/ui/LightboxImage";

export function BagClient() {
  const { items, subtotal, setQty, removeItem, ready } = useBag();
  const router = useRouter();
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkout() {
    setCheckingOut(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            qty: i.qty,
            kind: i.kind,
          })),
        }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.error ?? "Checkout failed");
      router.push(`/checkout/success?order=${encodeURIComponent(body.orderId)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setCheckingOut(false);
    }
  }

  if (!ready) {
    return <p className="text-sm text-muted-foreground">Loading bag…</p>;
  }

  if (items.length === 0) {
    return (
      <Card className="p-6 text-sm text-muted-foreground">
        Your bag is empty.{" "}
        <Link href="/catalog" className="text-accent-solid hover:underline">
          Browse the catalog
        </Link>{" "}
        or run{" "}
        <Link href="/analyze" className="text-accent-solid hover:underline">
          Skin AI
        </Link>{" "}
        to get matched products.
      </Card>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <Card key={item.productId} className="flex gap-4 p-4">
            <LightboxImage
              src={item.tryOnUrl || item.image}
              alt={item.name}
              className="h-24 w-20 shrink-0 rounded-xl"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs capitalize text-muted-foreground">{item.kind}</p>
                  {item.tryOnUrl && (
                    <p className="mt-1 text-xs text-accent-solid">Includes your try-on look</p>
                  )}
                </div>
                <p className="shrink-0 text-sm">${item.price * item.qty}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  Qty
                  <input
                    type="number"
                    min={1}
                    max={9}
                    value={item.qty}
                    onChange={(e) => setQty(item.productId, Number(e.target.value) || 1)}
                    className="w-14 rounded-lg border border-border bg-muted/40 px-2 py-1 text-foreground"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  className="text-xs text-muted-foreground hover:text-accent-solid"
                >
                  Remove
                </button>
                {item.kind === "apparel" && (
                  <Link
                    href={`/try-on/${item.productId}`}
                    className="text-xs text-accent-solid hover:underline"
                  >
                    Try on again
                  </Link>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="h-fit p-6">
        <h2 className="font-display text-xl font-semibold">Order summary</h2>
        <div className="mt-4 flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>${subtotal}</span>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Demo checkout — confirms the shop loop for judges. No real payment is charged.
        </p>
        {error && <p className="mt-3 text-sm text-amber-400">{error}</p>}
        <button
          type="button"
          disabled={checkingOut}
          onClick={() => void checkout()}
          className={`${buttonVariants("primary", "lg")} mt-5 w-full`}
        >
          {checkingOut ? "Confirming…" : "Checkout (demo)"}
        </button>
      </Card>
    </div>
  );
}
