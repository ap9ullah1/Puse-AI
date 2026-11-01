import Link from "next/link";
import { ScanFace, Shirt } from "lucide-react";
import { getAllProducts, SHOP_CATEGORIES, canTryOn } from "@/lib/products";
import { filterCatalog, type CatalogQuery } from "@/lib/catalog-query";
import { Reveal } from "@/components/Reveal";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card } from "@/components/ui/Card";
import { ProductCard } from "@/components/ProductCard";
import { ShopToolbar } from "@/components/ShopToolbar";

export const dynamic = "force-dynamic";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<CatalogQuery>;
}) {
  const query = await searchParams;
  const products = await getAllProducts();
  const filtered = filterCatalog(products, query);
  const browsing =
    !(query.q ?? "").trim() && query.vto !== "1" && (!query.sort || query.sort === "featured");
  const vtoReady = products.filter(canTryOn);

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16 sm:px-10">
      <Reveal>
        <p className="suite-tag">Puse AI store</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          {query.vto === "1" ? "Virtual try-on" : "Shop the full look"}
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Skincare matched to your skin, apparel you can try on, and one checkout for both.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href="/analyze" className={buttonVariants("primary", "md")}>
            <ScanFace className="h-4 w-4" />
            Skin AI match
          </Link>
          <Link href="/catalog?vto=1" className={buttonVariants("outline", "md")}>
            <Shirt className="h-4 w-4" />
            Try on
          </Link>
          <Link href="/bag" className={buttonVariants("ghost", "md")}>
            View bag
          </Link>
        </div>
      </Reveal>

      {browsing && (
        <Reveal delay={60}>
          <div className="overflow-hidden rounded-[1.5rem] border border-border bg-white shadow-[var(--shadow-soft)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/Puse%20AI%20Beauty%20Shop%20Experience.png"
              alt="Puse AI shop experience — Skin AI, skincare, apparel VTO, and checkout"
              className="w-full"
            />
          </div>
        </Reveal>
      )}

      <ShopToolbar action="/catalog" q={query.q} sort={query.sort} vto={query.vto === "1"} />

      {browsing && (
        <section>
          <Reveal>
            <h2 className="mb-6 font-display text-2xl font-semibold tracking-tight">Categories</h2>
          </Reveal>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {SHOP_CATEGORIES.map((cat, i) => (
              <Reveal key={cat.slug} delay={i * 40}>
                <Link href={`/shop/category/${cat.slug}`} className="group block">
                  <div className="relative h-44 overflow-hidden rounded-[var(--radius)] border border-border sm:h-56">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <p className="font-display text-lg font-semibold">{cat.name}</p>
                      <p className="text-xs text-muted-foreground">{cat.blurb}</p>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section>
        <Reveal>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-accent-solid">
                {browsing ? "Featured" : "Results"}
              </p>
              <h2 className="font-display text-2xl font-semibold tracking-tight">
                {browsing ? "Staff picks" : `${filtered.length} product${filtered.length === 1 ? "" : "s"}`}
              </h2>
            </div>
            {browsing && (
              <Link href="/shop/category/skincare" className="text-sm text-accent-solid hover:underline">
                Browse skincare
              </Link>
            )}
          </div>
        </Reveal>
        {filtered.length === 0 ? (
          <Card className="p-6 text-sm text-muted-foreground">
            Nothing matches that search.{" "}
            <Link href="/catalog" className="text-accent-solid hover:underline">
              Clear filters
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {(browsing ? filtered.filter((product) => product.featured).slice(0, 8) : filtered).map(
              (product) => (
                <ProductCard key={product.id} product={product} />
              )
            )}
          </div>
        )}
      </section>

      {browsing && (
        <section>
          <Reveal>
            <h2 className="mb-2 flex items-center gap-2 font-display text-2xl font-semibold tracking-tight">
              <Shirt className="h-5 w-5 text-accent-solid" />
              Ready to try on
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
              YouCam Clothes VTO renders the garment on your photo. Add the look to your bag when
              it lands.
            </p>
          </Reveal>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {vtoReady.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      <Reveal>
        <Card className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-lg font-semibold">Shopper codes</p>
            <p className="text-sm text-muted-foreground">
              <span className="text-accent-solid">PUSE10</span> ·{" "}
              <span className="text-accent-solid">SKINAI</span> ·{" "}
              <span className="text-accent-solid">TRYON</span>
            </p>
          </div>
          <Link href="/bag" className={buttonVariants("primary", "md")}>
            Go to bag
          </Link>
        </Card>
      </Reveal>
    </main>
  );
}
