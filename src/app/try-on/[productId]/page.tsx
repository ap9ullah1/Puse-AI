import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Shirt } from "lucide-react";
import { getApparelProductById } from "@/lib/products";
import { TryOnFlow } from "./try-on-flow";
import { Reveal } from "@/components/Reveal";

export default async function TryOnPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const product = await getApparelProductById(productId);

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-16 sm:px-10">
      <Reveal className="flex items-start gap-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="h-28 w-24 shrink-0 rounded-[var(--radius)] object-cover shadow-[var(--shadow-soft)]"
        />
        <div>
          <Link
            href={`/shop/${product.id}`}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-accent-solid"
          >
            <ChevronLeft className="h-4 w-4" />
            {product.name}
          </Link>
          <h1 className="mt-2 flex items-center gap-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            <Shirt className="hidden h-8 w-8 text-accent-solid sm:block" />
            Try it on
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {product.name} · ${product.price}
          </p>
        </div>
      </Reveal>
      <TryOnFlow product={product} />
    </main>
  );
}
