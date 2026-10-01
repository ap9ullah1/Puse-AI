import { Suspense } from "react";
import { CheckoutSuccessClient } from "./success-client";

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<main className="p-16 text-sm text-muted-foreground">Loading…</main>}>
      <CheckoutSuccessClient />
    </Suspense>
  );
}
