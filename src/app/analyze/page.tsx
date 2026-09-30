import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { AnalyzeFlow } from "./analyze-flow";

export default async function AnalyzePage() {
  const products = await getAllProducts();
  const skincareProducts = products.filter((p) => p.kind === "skincare");

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-16">
      <div>
        <Link href="/" className="text-sm text-zinc-500 hover:underline">
          ← Back
        </Link>
        <h1 className="mt-2 text-3xl font-semibold">Skin AI Analysis</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Upload a clear, forward-facing selfie. We run it through YouCam Skin AI and match your top
          concerns to products that actually address them.
        </p>
      </div>

      <AnalyzeFlow skincareProducts={skincareProducts} />
    </main>
  );
}
