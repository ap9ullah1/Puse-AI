import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { Card } from "@/components/ui/Card";
import { ProductThumb } from "@/components/ui/ProductThumb";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const products = await getAllProducts();
  const apparel = products.filter((p) => p.kind === "apparel");
  const skincare = products.filter((p) => p.kind === "skincare");

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-14 px-6 py-16">
      <div>
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back
        </Link>
        <h1 className="mt-3 font-display text-4xl italic">Catalog</h1>
      </div>

      <section>
        <h2 className="mb-4 font-display text-2xl italic">Apparel — try it on</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {apparel.map((product) => (
            <Link key={product.id} href={`/try-on/${product.id}`}>
              <Card className="overflow-hidden p-3 transition hover:-translate-y-0.5 hover:border-accent-solid/40">
                <ProductThumb
                  id={product.id}
                  kind="apparel"
                  className="mb-2 h-40 w-full rounded-[calc(var(--radius)-0.4rem)]"
                />
                <p className="text-sm font-medium">{product.name}</p>
                <p className="text-sm text-muted-foreground">${product.price}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-display text-2xl italic">Skincare</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {skincare.map((product) => (
            <Card key={product.id} className="overflow-hidden p-3">
              <ProductThumb
                id={product.id}
                kind="skincare"
                className="mb-2 h-40 w-full rounded-[calc(var(--radius)-0.4rem)]"
              />
              <p className="text-sm font-medium">{product.name}</p>
              <p className="text-sm text-muted-foreground">${product.price}</p>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
