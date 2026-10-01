import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllProducts, getProductById, isApparelProduct } from "@/lib/products";
import { ProductImage } from "@/components/ui/ProductImage";
import { AddToBagButton } from "@/components/AddToBagButton";
import { Reveal } from "@/components/Reveal";
import { buttonVariants } from "@/components/ui/button-variants";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

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
  const all = await getAllProducts();
  const alsoBought = all
    .filter((p) => p.id !== product.id && p.kind === product.kind)
    .slice(0, 4);

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-16 px-6 py-16 sm:px-10">
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
              ? "Try it on with YouCam Clothes VTO, then add the look to your bag."
              : "Matched from Skin AI concerns. Add to bag to complete diagnose → buy."}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <AddToBagButton
              productId={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              kind={product.kind}
            />
            {apparel ? (
              <Link href={`/try-on/${product.id}`} className={buttonVariants("outline", "md")}>
                Virtual try-on
              </Link>
            ) : (
              <Link href="/analyze" className={buttonVariants("outline", "md")}>
                Analyze my skin
              </Link>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Tip: open the shop agent and say “match my skin” or “try on a dress”.
          </p>
        </Reveal>
      </div>

      {alsoBought.length > 0 && (
        <section>
          <Reveal>
            <h2 className="mb-6 font-display text-2xl font-semibold tracking-tight">
              People also considered
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {alsoBought.map((p, i) => (
              <Reveal key={p.id} delay={i * 50}>
                <Link href={`/shop/${p.id}`}>
                  <Card className="overflow-hidden p-3 transition hover:border-accent-solid/40">
                    <ProductImage
                      id={p.id}
                      kind={p.kind}
                      name={p.name}
                      image={p.image}
                      className="mb-2 h-36 w-full rounded-[calc(var(--radius)-0.4rem)]"
                    />
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-sm text-muted-foreground">${p.price}</p>
                  </Card>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
