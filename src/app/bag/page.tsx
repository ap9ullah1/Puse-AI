import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getFeaturedProducts } from "@/lib/products";
import { Reveal } from "@/components/Reveal";
import { BagClient } from "./bag-client";

export const dynamic = "force-dynamic";

export default async function BagPage() {
  const featured = await getFeaturedProducts(4);
  const alsoBought = featured.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image,
    kind: p.kind,
    category: p.category,
    stock: p.stock,
  }));

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-16 sm:px-10">
      <Reveal>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-accent-solid"
        >
          <ChevronLeft className="h-4 w-4" />
          Continue shopping
        </Link>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Your bag
        </h1>
        <p className="mt-3 text-muted-foreground">
          Skin AI matches, VTO looks, and store finds — one checkout.
        </p>
      </Reveal>
      <BagClient alsoBought={alsoBought} />
    </main>
  );
}
