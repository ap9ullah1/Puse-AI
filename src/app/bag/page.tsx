import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { BagClient } from "./bag-client";

export default function BagPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-16 sm:px-10">
      <Reveal>
        <Link href="/catalog" className="text-sm text-muted-foreground hover:text-accent-solid">
          ← Continue shopping
        </Link>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Your bag
        </h1>
        <p className="mt-3 text-muted-foreground">
          Skincare matched by Skin AI and apparel you tried on — one checkout.
        </p>
      </Reveal>
      <BagClient />
    </main>
  );
}
