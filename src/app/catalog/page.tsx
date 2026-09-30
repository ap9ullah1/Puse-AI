import Link from "next/link";
import { getAllProducts } from "@/lib/products";

export default async function CatalogPage() {
  const products = await getAllProducts();
  const apparel = products.filter((p) => p.kind === "apparel");
  const skincare = products.filter((p) => p.kind === "skincare");

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-12 px-6 py-16">
      <div>
        <Link href="/" className="text-sm text-zinc-500 hover:underline">
          ← Back
        </Link>
        <h1 className="mt-2 text-3xl font-semibold">Catalog</h1>
      </div>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Apparel — try it on</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {apparel.map((product) => (
            <Link
              key={product.id}
              href={`/try-on/${product.id}`}
              className="rounded-xl border border-zinc-200 p-3 transition hover:border-black dark:border-zinc-800 dark:hover:border-white"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image}
                alt={product.name}
                className="mb-2 h-40 w-full rounded-lg object-cover"
              />
              <p className="text-sm font-medium">{product.name}</p>
              <p className="text-sm text-zinc-500">${product.price}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Skincare</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {skincare.map((product) => (
            <div key={product.id} className="rounded-xl border border-zinc-200 p-3 dark:border-zinc-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image}
                alt={product.name}
                className="mb-2 h-40 w-full rounded-lg object-cover"
              />
              <p className="text-sm font-medium">{product.name}</p>
              <p className="text-sm text-zinc-500">${product.price}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
