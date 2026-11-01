"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronLeft, ShoppingBag, Tag, Trash2 } from "lucide-react";
import { useBag } from "@/lib/bag";
import { validateCoupon, calcTotals, type CouponResult } from "@/lib/coupons";
import { APPAREL_SIZES, SHOE_SIZES } from "@/lib/commerce";
import { Card } from "@/components/ui/Card";
import { buttonVariants } from "@/components/ui/button-variants";
import { LightboxImage } from "@/components/ui/LightboxImage";
import { QtyStepper } from "@/components/QtyStepper";
import { TrustRow } from "@/components/TrustRow";
import { AddToBagButton } from "@/components/AddToBagButton";

function sizesFor(item: { kind: string; category?: string }) {
  if (item.kind === "apparel") return APPAREL_SIZES;
  if (item.category === "footwear") return SHOE_SIZES;
  return null;
}

export function BagClient({
  alsoBought,
}: {
  alsoBought: {
    id: string;
    name: string;
    price: number;
    image: string;
    kind: "skincare" | "apparel" | "accessory";
    category: string;
    stock: number;
  }[];
}) {
  const { items, subtotal, setQty, setSize, removeItem, ready } = useBag();
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<CouponResult | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const totals = useMemo(() => calcTotals(subtotal, coupon), [subtotal, coupon]);
  const missingSize = items.some((item) => {
    const sizes = sizesFor(item);
    return Boolean(sizes && !item.size);
  });

  function applyCoupon() {
    const next = validateCoupon(couponInput);
    if (!next) {
      setCoupon(null);
      setCouponError("That code isn’t active. Try PUSE10, SKINAI, or TRYON.");
      return;
    }
    setCoupon(next);
    setCouponError(null);
  }

  if (!ready) {
    return <p className="text-sm text-muted-foreground">Loading bag…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col gap-10">
        <Card className="flex flex-col items-start gap-4 p-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-accent-solid">
            <ShoppingBag className="h-5 w-5" />
          </span>
          <h2 className="font-display text-2xl font-semibold">Your bag is empty</h2>
          <p className="text-sm text-muted-foreground">
            Add a Skin AI match, try a look on, or browse the store.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/catalog" className={buttonVariants("primary", "md")}>
              Start shopping
            </Link>
            <Link href="/catalog?vto=1" className={buttonVariants("outline", "md")}>
              Try something on
            </Link>
          </div>
        </Card>
        {alsoBought.length > 0 && (
          <section>
            <h3 className="mb-4 font-display text-xl font-semibold">Popular right now</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {alsoBought.map((product) => (
                <Card key={product.id} className="flex flex-col overflow-hidden p-3">
                  <Link href={`/shop/${product.id}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="mb-2 h-36 w-full rounded-xl object-cover"
                    />
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">${product.price}</p>
                  </Link>
                  <div className="mt-auto pt-3">
                    <AddToBagButton
                      productId={product.id}
                      name={product.name}
                      price={product.price}
                      image={product.image}
                      kind={product.kind}
                      category={product.category}
                      stock={product.stock}
                      className="w-full"
                    />
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="flex flex-col gap-4">
        {items.map((item) => {
          const sizes = sizesFor(item);
          return (
            <Card key={`${item.productId}-${item.size ?? "os"}`} className="flex gap-4 p-4">
              <LightboxImage
                src={item.tryOnUrl || item.image}
                alt={item.name}
                className="h-28 w-24 shrink-0 rounded-xl"
              />
              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      href={`/shop/${item.productId}`}
                      className="font-medium hover:text-accent-solid"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs capitalize text-muted-foreground">{item.kind}</p>
                    {item.tryOnUrl && (
                      <p className="mt-1 text-xs text-accent-solid">Includes your try-on look</p>
                    )}
                  </div>
                  <p className="shrink-0 text-sm font-medium">${item.price * item.qty}</p>
                </div>
                {sizes && (
                  <label className="flex items-center gap-2 text-xs text-muted-foreground">
                    Size
                    <select
                      value={item.size ?? ""}
                      onChange={(e) => setSize(item.productId, item.size, e.target.value)}
                      className="rounded-full border border-border bg-muted/40 px-3 py-1.5 text-foreground outline-none focus:border-accent-solid"
                    >
                      {!item.size && <option value="">Choose</option>}
                      {sizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                <div className="flex flex-wrap items-center gap-3">
                  <QtyStepper
                    qty={item.qty}
                    onChange={(qty) => setQty(item.productId, qty, item.size)}
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId, item.size)}
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-accent-solid"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </button>
                  {(item.vto || item.tryOnUrl) && (
                    <Link
                      href={`/try-on/${item.productId}`}
                      className="text-xs text-accent-solid hover:underline"
                    >
                      Try on
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          );
        })}

        {alsoBought.length > 0 && (
          <section className="pt-4">
            <h3 className="mb-4 font-display text-xl font-semibold">People also bought</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {alsoBought.slice(0, 3).map((product) => (
                <Card key={product.id} className="flex flex-col p-3">
                  <Link href={`/shop/${product.id}`} className="block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="mb-2 h-28 w-full rounded-lg object-cover"
                    />
                    <p className="truncate text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">${product.price}</p>
                  </Link>
                  <div className="mt-auto pt-3">
                    <AddToBagButton
                      productId={product.id}
                      name={product.name}
                      price={product.price}
                      image={product.image}
                      kind={product.kind}
                      category={product.category}
                      stock={product.stock}
                      label="Add"
                      className="w-full"
                    />
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <Card className="p-5">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
            <Tag className="h-4 w-4 text-accent-solid" />
            Gift code
          </h2>
          <div className="mt-3 flex gap-2">
            <input
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              placeholder="PUSE10"
              className="min-w-0 flex-1 rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm outline-none focus:border-accent-solid"
            />
            <button type="button" onClick={applyCoupon} className={buttonVariants("outline", "md")}>
              Apply
            </button>
          </div>
          {coupon && (
            <p className="mt-2 text-xs text-accent-solid">
              {coupon.code} — {coupon.label}
            </p>
          )}
          {couponError && <p className="mt-2 text-xs text-amber-700">{couponError}</p>}
        </Card>

        <Card className="h-fit p-6">
          <h2 className="font-display text-xl font-semibold">Order summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${totals.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Discount</span>
              <span>{totals.discount ? `−$${totals.discount}` : "$0"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{totals.shippingCost === 0 ? "Free" : `$${totals.shippingCost}`}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 font-medium">
              <span>Total</span>
              <span className="text-accent-solid">${totals.total}</span>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Standard delivery shown. Express is available at checkout. Free standard shipping over
            $100.
          </p>
          {missingSize && (
            <p className="mt-3 text-xs text-amber-700">Choose a size for every apparel item.</p>
          )}
          {missingSize ? (
            <button
              type="button"
              disabled
              className={`${buttonVariants("primary", "lg")} mt-5 w-full`}
            >
              Choose sizes to continue
            </button>
          ) : (
            <Link
              href={`/checkout${coupon ? `?coupon=${encodeURIComponent(coupon.code)}` : ""}`}
              className={`${buttonVariants("primary", "lg")} mt-5 w-full`}
            >
              Checkout · ${totals.total}
            </Link>
          )}
          <Link
            href="/catalog"
            className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-accent-solid"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Continue shopping
          </Link>
          <div className="mt-5 border-t border-border pt-4">
            <TrustRow compact />
          </div>
        </Card>
      </div>
    </div>
  );
}
