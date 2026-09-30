import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { AnalyzeFlow } from "./analyze-flow";
import { Reveal } from "@/components/Reveal";

export const dynamic = "force-dynamic";

export default async function AnalyzePage() {
  const products = await getAllProducts();
  const skincareProducts = products.filter((p) => p.kind === "skincare");

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-16 sm:px-10">
      <Reveal className="flex flex-col items-start gap-4">
        <Link href="/" className="text-sm text-muted-foreground transition hover:text-accent-solid">
          ← Back
        </Link>
        <span className="suite-tag">Skin AI</span>
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          See what your skin{" "}
          <span className="suite-title-band">actually needs</span>
        </h1>
        <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
          Upload a clear, forward-facing selfie. We run it through YouCam Skin AI and match your
          top concerns to products that actually address them.
        </p>
      </Reveal>

      <AnalyzeFlow skincareProducts={skincareProducts} />
    </main>
  );
}
