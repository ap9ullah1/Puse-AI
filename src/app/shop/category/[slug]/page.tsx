import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import {
  SHOP_CATEGORIES,
  getProductsByCategory,
  type ShopCategorySlug,
} from "@/lib/products";
import { filterCatalog, type CatalogQuery } from "@/lib/catalog-query";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/Reveal";
import { ProductCard } from "@/components/ProductCard";
import { ShopToolbar } from "@/components/ShopToolbar";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<CatalogQuery>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const category = SHOP_CATEGORIES.find((c) => c.slug === slug);
  if (!category) notFound();

  const products = filterCatalog(await getProductsByCategory(slug as ShopCategorySlug), query);

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 sm:px-10">
      <Reveal>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-accent-solid"
        >
          <ChevronLeft className="h-4 w-4" />
          All shop
        </Link>
        <div className="mt-4 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="suite-tag">{category.name}</p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              {category.name}
            </h1>
            <p className="mt-3 max-w-xl text-muted-foreground">{category.blurb}</p>
          </div>
          <div className="relative h-40 overflow-hidden rounded-[var(--radius)] border border-border lg:h-48">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={category.image} alt="" className="h-full w-full object-cover" />
          </div>
        </div>
      </Reveal>

      <ShopToolbar
        action={`/shop/category/${category.slug}`}
        q={query.q}
        sort={query.sort}
        vto={query.vto === "1"}
      />

      {products.length === 0 ? (
        <Card className="p-6 text-sm text-muted-foreground">
          Nothing in this category matches.{" "}
          <Link href={`/shop/category/${category.slug}`} className="text-accent-solid hover:underline">
            Clear filters
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
