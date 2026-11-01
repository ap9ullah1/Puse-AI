"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, Package, Shirt, Store } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { buttonVariants } from "@/components/ui/button-variants";
import { Reveal } from "@/components/Reveal";

export function CheckoutSuccessClient() {
  const params = useSearchParams();
  const orderId = params.get("order");

  return (
    <main className="mx-auto flex max-w-lg flex-col gap-8 px-6 py-16 sm:px-10">
      <Reveal>
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-solid text-[var(--accent-solid-foreground)]">
          <Check className="h-5 w-5" />
        </span>
        <p className="suite-tag mt-4">Order confirmed</p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">
          Thanks — you&apos;re set
        </h1>
        <p className="mt-3 text-muted-foreground">
          We saved the order with your shipping details. Any try-on look you added stays on the
          order and in Looks.
        </p>
      </Reveal>
      <Reveal>
        <Card className="flex flex-col gap-4 p-6">
          {orderId && (
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Order</p>
              <p className="mt-1 break-all font-mono text-sm text-accent-solid">{orderId}</p>
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            <Link href="/orders" className={buttonVariants("primary", "md")}>
              <Package className="h-4 w-4" />
              View orders
            </Link>
            <Link href="/history?case=try-on" className={buttonVariants("outline", "md")}>
              <Shirt className="h-4 w-4" />
              Your looks
            </Link>
            <Link href="/catalog" className={buttonVariants("ghost", "md")}>
              <Store className="h-4 w-4" />
              Keep shopping
            </Link>
          </div>
        </Card>
      </Reveal>
    </main>
  );
}
