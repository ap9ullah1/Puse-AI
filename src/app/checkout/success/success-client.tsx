"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useBag } from "@/lib/bag";
import { Card } from "@/components/ui/Card";
import { buttonVariants } from "@/components/ui/button-variants";
import { Reveal } from "@/components/Reveal";

export function CheckoutSuccessClient() {
  const params = useSearchParams();
  const orderId = params.get("order");
  const { clear } = useBag();

  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <main className="mx-auto flex max-w-lg flex-col gap-8 px-6 py-16 sm:px-10">
      <Reveal>
        <p className="suite-tag">Demo order confirmed</p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">
          You&apos;re set
        </h1>
        <p className="mt-3 text-muted-foreground">
          This closes the ecommerce loop for the hackathon: diagnose → match → try on → buy.
          No payment was charged.
        </p>
      </Reveal>
      <Reveal>
        <Card className="flex flex-col gap-4 p-6">
          {orderId && (
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Order id</p>
              <p className="mt-1 font-mono text-sm text-accent-solid">{orderId}</p>
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            <Link href="/history" className={buttonVariants("primary", "md")}>
              View saved results
            </Link>
            <Link href="/catalog" className={buttonVariants("outline", "md")}>
              Keep shopping
            </Link>
          </div>
        </Card>
      </Reveal>
    </main>
  );
}
