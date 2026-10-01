import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductById, isApparelProduct } from "@/lib/products";
import { ProductImage } from "@/components/ui/ProductImage";
import { AddToBagButton } from "@/components/AddToBagButton";
import { Reveal } from "@/components/Reveal";
import { buttonVariants } from "@/components/ui/button-variants";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function ShopProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const product = await getProductById(productId);
  if (!product) notFound();

  const apparel = isApparelProduct(product);

  return (
    <main className="mx-auto grid max-w-5xl gap-10 px-6 py-16 sm:grid-cols-2 sm:px-10">
      <Reveal>
        <ProductImage
          id={product.id}
          kind={product.kind}
          name={product.name}
          image={product.image}
          className="h-[28rem] w-full rounded-[var(--radius)]"
        />
      </Reveal>
      <Reveal delay={80} className="flex flex-col gap-5">
        <Link href="/catalog" className="text-sm text-muted-foreground hover:text-accent-solid">
          ← Catalog
        </Link>
        <div className="flex flex-wrap gap-2">
          <Badge>{product.kind}</Badge>
          {"concern" in product && product.concern && (
            <Badge>Targets {product.concern}</Badge>
          )}
        </div>
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          {product.name}
        </h1>
        <p className="text-2xl text-accent-solid">${product.price}</p>
        <p className="text-muted-foreground">
          {apparel
            ? "Try it on with YouCam Clothes VTO, then add the look to your bag — same ecommerce flow as a fashion PDP."
            : "Matched from Skin AI concerns. Add it to your bag to complete the diagnose → buy loop."}
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <AddToBagButton
            productId={product.id}
            name={product.name}
            price={product.price}
            image={product.image}
            kind={product.kind}
          />
          {apparel && (
            <Link href={`/try-on/${product.id}`} className={buttonVariants("outline", "md")}>
              Virtual try-on
            </Link>
          )}
          {!apparel && (
            <Link href="/analyze" className={buttonVariants("outline", "md")}>
              Analyze my skin
            </Link>
          )}
        </div>
      </Reveal>
    </main>
  );
}
