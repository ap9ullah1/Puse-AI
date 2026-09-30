import { notFound } from "next/navigation";
import Link from "next/link";
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
          <Link href="/catalog" className="text-sm text-muted-foreground hover:text-accent-solid">
            ← Back to catalog
          </Link>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Try on: {product.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">${product.price}</p>
        </div>
      </Reveal>
      <TryOnFlow product={product} />
    </main>
  );
}
