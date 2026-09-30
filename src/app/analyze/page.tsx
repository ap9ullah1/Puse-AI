import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { AnalyzeFlow } from "./analyze-flow";

export const dynamic = "force-dynamic";

export default async function AnalyzePage() {
  const products = await getAllProducts();
  const skincareProducts = products.filter((p) => p.kind === "skincare");

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-16">
      <div>
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back
        </Link>
        <h1 className="mt-3 font-display text-4xl italic">Skin AI Analysis</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Upload a clear, forward-facing selfie. We run it through YouCam Skin AI and match your
          top concerns to products that actually address them.
        </p>
      </div>

      <AnalyzeFlow skincareProducts={skincareProducts} />
    </main>
  );
}
