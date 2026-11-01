"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useMemo, useState } from "react";
import { ChevronLeft, CreditCard, Lock, Truck } from "lucide-react";
import { useBag } from "@/lib/bag";
import { calcTotals, validateCoupon, type CouponResult } from "@/lib/coupons";
import {
  cardBrand,
  expiryOk,
  formatCardNumber,
  luhnOk,
  SHIPPING_METHODS,
  type ShippingMethodId,
} from "@/lib/commerce";
import { Card } from "@/components/ui/Card";
import { buttonVariants } from "@/components/ui/button-variants";
import { Reveal } from "@/components/Reveal";

const FIELDS = [
  ["email", "Email", "email", "you@email.com"],
  ["fullName", "Full name", "text", "Alex Morgan"],
  ["phone", "Phone", "tel", "+20 100 000 0000"],
  ["address", "Address", "text", "12 Nile Street"],
  ["city", "City", "text", "Cairo"],
  ["country", "Country", "text", "Egypt"],
  ["postal", "Postal code", "text", "11511"],
] as const;

function CheckoutForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { items, subtotal, clear, ready } = useBag();
  const initialCoupon = validateCoupon(params.get("coupon") ?? "");
  const [coupon] = useState<CouponResult | null>(initialCoupon);
  const [method, setMethod] = useState<ShippingMethodId>("standard");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    email: "",
    fullName: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    postal: "",
  });
  const [card, setCard] = useState({ name: "", number: "", expiry: "", cvc: "" });

  const totals = useMemo(() => calcTotals(subtotal, coupon, method), [subtotal, coupon, method]);
  const brand = cardBrand(card.number);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    if (!luhnOk(card.number)) {
      setError("Enter a valid card number.");
      return;
    }
    if (!expiryOk(card.expiry)) {
      setError("Enter a future expiry date as MM/YY.");
      return;
    }
    const cvcLength = brand === "Amex" ? 4 : 3;
    if (card.cvc.replace(/\D/g, "").length !== cvcLength) {
      setError(`Enter a ${cvcLength}-digit security code.`);
      return;
    }
    if (card.name.trim().length < 2) {
      setError("Enter the name on the card.");
      return;
    }

    setLoading(true);
    setError(null);
    const digits = card.number.replace(/\D/g, "");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            qty: item.qty,
            size: item.size,
            tryOnUrl: item.tryOnUrl,
          })),
          couponCode: coupon?.code,
          shippingMethod: method,
          email: form.email,
          shipping: {
            fullName: form.fullName,
            phone: form.phone,
            address: form.address,
            city: form.city,
            country: form.country,
            postal: form.postal,
          },
          payment: { brand, last4: digits.slice(-4) },
        }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.error ?? "Checkout failed");
      clear();
      router.push(`/checkout/success?order=${encodeURIComponent(body.orderId)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  if (!ready) return <p className="text-sm text-muted-foreground">Loading…</p>;

  if (items.length === 0) {
    return (
      <Card className="p-6 text-sm text-muted-foreground">
        Your bag is empty.{" "}
        <Link href="/catalog" className="text-accent-solid hover:underline">
          Return to shop
        </Link>
      </Card>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="flex flex-col gap-4">
        <Card className="flex flex-col gap-4 p-6">
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
            <Truck className="h-5 w-5 text-accent-solid" />
            Shipping
          </h2>
          {FIELDS.map(([key, label, type, placeholder]) => (
            <label key={key} className="flex flex-col gap-1.5 text-sm">
              <span className="text-muted-foreground">{label}</span>
              <input
                required
                type={type}
                autoComplete={key === "email" ? "email" : key === "phone" ? "tel" : "on"}
                placeholder={placeholder}
                value={form[key]}
                onChange={(e) => setForm((current) => ({ ...current, [key]: e.target.value }))}
                className="rounded-xl border border-border bg-muted/40 px-3 py-2.5 outline-none focus:border-accent-solid"
              />
            </label>
          ))}
          <fieldset className="flex flex-col gap-2">
            <legend className="text-sm text-muted-foreground">Delivery</legend>
            {(Object.values(SHIPPING_METHODS) as (typeof SHIPPING_METHODS)[ShippingMethodId][]).map(
              (option) => {
                const preview = calcTotals(subtotal, coupon, option.id);
                const active = method === option.id;
                return (
                  <label
                    key={option.id}
                    className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-3 py-3 text-sm ${
                      active ? "border-accent-solid bg-accent-solid/10" : "border-border"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shippingMethod"
                        checked={active}
                        onChange={() => setMethod(option.id)}
                        className="accent-[var(--accent-solid)]"
                      />
                      <span>
                        <span className="block font-medium">{option.label}</span>
                        <span className="text-xs text-muted-foreground">{option.detail}</span>
                      </span>
                    </span>
                    <span>{preview.shippingCost === 0 ? "Free" : `$${preview.shippingCost}`}</span>
                  </label>
                );
              }
            )}
          </fieldset>
        </Card>

        <Card className="flex flex-col gap-4 p-6">
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
            <CreditCard className="h-5 w-5 text-accent-solid" />
            Payment
          </h2>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-muted-foreground">Name on card</span>
            <input
              required
              autoComplete="cc-name"
              value={card.name}
              onChange={(e) => setCard((current) => ({ ...current, name: e.target.value }))}
              className="rounded-xl border border-border bg-muted/40 px-3 py-2.5 outline-none focus:border-accent-solid"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="flex items-center justify-between text-muted-foreground">
              Card number
              <span className="text-xs text-accent-solid">{brand}</span>
            </span>
            <input
              required
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="4242 4242 4242 4242"
              value={card.number}
              onChange={(e) =>
                setCard((current) => ({ ...current, number: formatCardNumber(e.target.value) }))
              }
              className="rounded-xl border border-border bg-muted/40 px-3 py-2.5 outline-none focus:border-accent-solid"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="text-muted-foreground">Expiry</span>
              <input
                required
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="MM/YY"
                value={card.expiry}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
                  const next = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
                  setCard((current) => ({ ...current, expiry: next }));
                }}
                className="rounded-xl border border-border bg-muted/40 px-3 py-2.5 outline-none focus:border-accent-solid"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="text-muted-foreground">CVC</span>
              <input
                required
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="123"
                value={card.cvc}
                onChange={(e) =>
                  setCard((current) => ({
                    ...current,
                    cvc: e.target.value.replace(/\D/g, "").slice(0, 4),
                  }))
                }
                className="rounded-xl border border-border bg-muted/40 px-3 py-2.5 outline-none focus:border-accent-solid"
              />
            </label>
          </div>
          <p className="flex items-start gap-2 text-xs text-muted-foreground">
            <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-solid" />
            The card is checked in your browser. Only the brand and last four digits are saved with
            the order — the full number never leaves this page.
          </p>
        </Card>
      </div>

      <Card className="h-fit p-6">
        <h2 className="font-display text-xl font-semibold">Review</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {items.map((item) => (
            <li key={`${item.productId}-${item.size ?? ""}`} className="flex justify-between gap-3">
              <span className="min-w-0 text-muted-foreground">
                <span className="block truncate text-foreground">
                  {item.qty}× {item.name}
                </span>
                {item.size && <span className="text-xs">Size {item.size}</span>}
                {item.tryOnUrl && <span className="block text-xs text-accent-solid">Try-on look</span>}
              </span>
              <span>${item.price * item.qty}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${totals.subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Discount {coupon ? `(${coupon.code})` : ""}
            </span>
            <span>{totals.discount ? `−$${totals.discount}` : "$0"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span>{totals.shippingCost === 0 ? "Free" : `$${totals.shippingCost}`}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span className="text-accent-solid">${totals.total}</span>
          </div>
        </div>
        {error && <p className="mt-3 text-sm text-amber-700">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className={`${buttonVariants("primary", "lg")} mt-5 w-full`}
        >
          <Lock className="h-4 w-4" />
          {loading ? "Placing order…" : `Place order · $${totals.total}`}
        </button>
        <Link href="/bag" className={`${buttonVariants("ghost", "md")} mt-2 w-full`}>
          Back to bag
        </Link>
      </Card>
    </form>
  );
}

export default function CheckoutPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-16 sm:px-10">
      <Reveal>
        <Link
          href="/bag"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-accent-solid"
        >
          <ChevronLeft className="h-4 w-4" />
          Bag
        </Link>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">Checkout</h1>
        <p className="mt-2 text-muted-foreground">
          Shipping, delivery speed, and payment — then your order is confirmed.
        </p>
      </Reveal>
      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading checkout…</p>}>
        <CheckoutForm />
      </Suspense>
    </main>
  );
}
