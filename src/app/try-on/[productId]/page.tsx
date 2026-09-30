import { notFound } from "next/navigation";
import Link from "next/link";
import { getApparelProductById } from "@/lib/products";
import { TryOnFlow } from "./try-on-flow";

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
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-16">
      <div>
        <Link href="/catalog" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to catalog
        </Link>
        <h1 className="mt-3 font-display text-4xl italic">Try on: {product.name}</h1>
      </div>
      <TryOnFlow product={product} />
    </main>
  );
}
