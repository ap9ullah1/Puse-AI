import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { Card } from "@/components/ui/Card";
import { ProductImage } from "@/components/ui/ProductImage";
import { Reveal } from "@/components/Reveal";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const products = await getAllProducts();
  const apparel = products.filter((p) => p.kind === "apparel");
  const skincare = products.filter((p) => p.kind === "skincare");

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16 sm:px-10">
      <Reveal>
        <Link href="/" className="text-sm text-muted-foreground hover:text-accent-solid">
          ← Back
        </Link>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Shop
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Apparel you can try on with YouCam VTO, and skincare matched from Skin AI — add either to
          your bag and checkout.
        </p>
      </Reveal>

      <section>
        <Reveal>
          <h2 className="mb-6 font-display text-2xl font-semibold tracking-tight">
            Apparel — try on, then buy
          </h2>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {apparel.map((product, i) => (
            <Reveal key={product.id} delay={i * 60}>
              <Card className="overflow-hidden p-3 transition hover:-translate-y-0.5 hover:border-accent-solid/40">
                <Link href={`/shop/${product.id}`}>
                  <ProductImage
                    id={product.id}
                    kind="apparel"
                    name={product.name}
                    image={product.image}
                    className="mb-2 h-56 w-full rounded-[calc(var(--radius)-0.4rem)]"
                  />
                </Link>
                <Link href={`/shop/${product.id}`} className="block hover:text-accent-solid">
                  <p className="text-sm font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">${product.price}</p>
                </Link>
                <div className="mt-2 flex flex-col gap-1 text-xs font-medium">
                  <Link href={`/try-on/${product.id}`} className="text-accent-solid hover:underline">
                    Virtual try-on →
                  </Link>
                  <Link href={`/shop/${product.id}`} className="text-muted-foreground hover:text-accent-solid">
                    Product page
                  </Link>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <section>
        <Reveal>
          <h2 className="mb-6 font-display text-2xl font-semibold tracking-tight">Skincare</h2>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {skincare.map((product, i) => (
            <Reveal key={product.id} delay={i * 60}>
              <Link href={`/shop/${product.id}`}>
                <Card className="overflow-hidden p-3 transition hover:-translate-y-0.5 hover:border-accent-solid/40">
                  <ProductImage
                    id={product.id}
                    kind="skincare"
                    name={product.name}
                    image={product.image}
                    className="mb-2 h-40 w-full rounded-[calc(var(--radius)-0.4rem)]"
                  />
                  <p className="text-sm font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">${product.price}</p>
                  {"concern" in product && (
                    <p className="mt-1 text-xs capitalize text-accent-solid">
                      Targets {product.concern}
                    </p>
                  )}
                </Card>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
