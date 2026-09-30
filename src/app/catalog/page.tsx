import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { Card } from "@/components/ui/Card";
import { ProductThumb } from "@/components/ui/ProductThumb";
import { Reveal } from "@/components/Reveal";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const products = await getAllProducts();
  const apparel = products.filter((p) => p.kind === "apparel");
  const skincare = products.filter((p) => p.kind === "skincare");

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16 sm:px-10">
      <Reveal>
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back
        </Link>
        <h1 className="mt-3 font-display text-4xl italic sm:text-5xl">Catalog</h1>
      </Reveal>

      <section>
        <Reveal>
          <h2 className="mb-6 font-display text-2xl italic">Apparel — try it on</h2>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {apparel.map((product, i) => (
            <Reveal key={product.id} delay={i * 60}>
              <Link href={`/try-on/${product.id}`}>
                <Card className="overflow-hidden p-3 transition hover:-translate-y-0.5 hover:border-accent-solid/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="mb-2 h-56 w-full rounded-[calc(var(--radius)-0.4rem)] object-cover"
                  />
                  <p className="text-sm font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">${product.price}</p>
                </Card>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section>
        <Reveal>
          <h2 className="mb-6 font-display text-2xl italic">Skincare</h2>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {skincare.map((product, i) => (
            <Reveal key={product.id} delay={i * 60}>
              <Card className="overflow-hidden p-3">
                <ProductThumb
                  id={product.id}
                  kind="skincare"
                  className="mb-2 h-40 w-full rounded-[calc(var(--radius)-0.4rem)]"
                />
                <p className="text-sm font-medium">{product.name}</p>
                <p className="text-sm text-muted-foreground">${product.price}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
