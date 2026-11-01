import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getAllProducts, getProductById, canTryOn, SHOP_CATEGORIES } from "@/lib/products";
import { ProductImage } from "@/components/ui/ProductImage";
import { Reveal } from "@/components/Reveal";
import { Badge } from "@/components/ui/Badge";
import { ProductPurchase } from "@/components/ProductPurchase";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function ShopProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const product = await getProductById(productId);
  if (!product) notFound();

  const tryOn = canTryOn(product);
  const all = await getAllProducts();
  const alsoBought = all
    .filter((p) => p.id !== product.id && (p.category === product.category || p.kind === product.kind))
    .slice(0, 4);
  const categoryMeta = SHOP_CATEGORIES.find((c) => c.slug === product.category);

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16 sm:px-10">
      <div className="grid gap-10 sm:grid-cols-2">
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
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-accent-solid"
            >
              <ChevronLeft className="h-4 w-4" />
              Shop
            </Link>
            {categoryMeta && (
              <Link
                href={`/shop/category/${product.category}`}
                className="text-muted-foreground hover:text-accent-solid"
              >
                {categoryMeta.name}
              </Link>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge className="capitalize">{product.kind}</Badge>
            {tryOn && <Badge>Virtual try-on</Badge>}
            {"concern" in product && product.concern && (
              <Badge className="capitalize">Targets {product.concern}</Badge>
            )}
          </div>
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            {product.name}
          </h1>
          <p className="text-2xl text-accent-solid">${product.price}</p>
          <p className="text-muted-foreground">
            {product.description ||
              (tryOn
                ? "Try it on with YouCam Clothes VTO, then add the look to your bag."
                : "Add it to your bag and check out in the same Puse store.")}
          </p>
          <ProductPurchase
            tryOn={tryOn}
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              kind: product.kind,
              category: product.category,
              stock: product.stock,
            }}
          />
        </Reveal>
      </div>

      {alsoBought.length > 0 && (
        <section>
          <Reveal>
            <h2 className="mb-6 font-display text-2xl font-semibold tracking-tight">
              People also bought
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {alsoBought.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
