import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { Card } from "@/components/ui/Card";
import { ProductImage } from "@/components/ui/ProductImage";
import { Reveal } from "@/components/Reveal";
import { AddToBagButton } from "@/components/AddToBagButton";
import { buttonVariants } from "@/components/ui/button-variants";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const products = await getAllProducts();
  const apparel = products.filter((p) => p.kind === "apparel");
  const skincare = products.filter((p) => p.kind === "skincare");
  const featured = [...skincare.slice(0, 2), ...apparel.slice(0, 2)];

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
          Skincare from YouCam Skin AI matches and apparel you can try on with Clothes VTO — then
          one bag. Ask the floating shop agent if you want a guided pick.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <a href="#featured" className={buttonVariants("outline", "md")}>
            Featured
          </a>
          <a href="#apparel" className={buttonVariants("outline", "md")}>
            Apparel VTO
          </a>
          <a href="#skincare" className={buttonVariants("outline", "md")}>
            Skincare
          </a>
          <Link href="/analyze" className={buttonVariants("primary", "md")}>
            Run Skin AI first
          </Link>
        </div>
      </Reveal>

      <section id="featured">
        <Reveal>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-accent-solid">
            Picked for the demo
          </p>
          <h2 className="mb-6 font-display text-2xl font-semibold tracking-tight">Featured</h2>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {featured.map((product, i) => (
            <Reveal key={product.id} delay={i * 50}>
              <Card className="flex h-full flex-col overflow-hidden p-3 transition hover:border-accent-solid/40">
                <Link href={`/shop/${product.id}`}>
                  <ProductImage
                    id={product.id}
                    kind={product.kind}
                    name={product.name}
                    image={product.image}
                    className="mb-2 h-44 w-full rounded-[calc(var(--radius)-0.4rem)]"
                  />
                  <p className="text-sm font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">${product.price}</p>
                </Link>
                <div className="mt-auto flex flex-col gap-2 pt-3">
                  <AddToBagButton
                    productId={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.image}
                    kind={product.kind}
                    className="w-full"
                  />
                  {product.kind === "apparel" && (
                    <Link
                      href={`/try-on/${product.id}`}
                      className={`${buttonVariants("ghost", "md")} w-full`}
                    >
                      Virtual try-on
                    </Link>
                  )}
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="apparel">
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
                  <Link
                    href={`/shop/${product.id}`}
                    className="text-muted-foreground hover:text-accent-solid"
                  >
                    Product page
                  </Link>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="skincare">
        <Reveal>
          <h2 className="mb-6 font-display text-2xl font-semibold tracking-tight">Skincare</h2>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {skincare.map((product, i) => (
            <Reveal key={product.id} delay={i * 60}>
              <Card className="flex h-full flex-col overflow-hidden p-3 transition hover:-translate-y-0.5 hover:border-accent-solid/40">
                <Link href={`/shop/${product.id}`}>
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
                </Link>
                <div className="mt-auto pt-3">
                  <AddToBagButton
                    productId={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.image}
                    kind="skincare"
                    className="w-full"
                  />
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
