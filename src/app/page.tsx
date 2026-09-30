import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";

export default function Home() {
  return (
    <main className="mx-auto flex flex-1 w-full max-w-3xl flex-col items-center justify-center gap-12 px-6 py-24 text-center">
      <div className="flex flex-col items-center gap-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-[var(--shadow-soft)]">
          <span className="pulse-gradient-bg pulse-ring h-2 w-2 rounded-full" />
          Built with the YouCam API
        </span>

        <h1 className="font-display text-5xl italic leading-tight sm:text-6xl">
          Find your skin&apos;s <span className="pulse-gradient-text not-italic">pulse</span>
        </h1>

        <p className="max-w-xl text-lg text-muted-foreground">
          Upload a selfie for a real AI skin analysis, get matched to skincare that actually
          targets your concerns, and try on apparel before you buy — powered by YouCam Skin AI
          and Virtual Try-On.
        </p>
      </div>

      <div className="grid w-full gap-4 sm:grid-cols-2">
        <Link
          href="/analyze"
          className="group flex flex-col items-start gap-3 rounded-[var(--radius)] border border-border bg-card p-6 text-left shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:border-accent-solid/40"
        >
          <span className="pulse-gradient-bg flex h-10 w-10 items-center justify-center rounded-full text-lg text-white">
            ✦
          </span>
          <span className="font-display text-xl italic">Analyze my skin</span>
          <span className="text-sm text-muted-foreground">
            Eight concerns scored by YouCam Skin AI
          </span>
        </Link>

        <Link
          href="/catalog"
          className="group flex flex-col items-start gap-3 rounded-[var(--radius)] border border-border bg-card p-6 text-left shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:border-accent-solid/40"
        >
          <span className="pulse-gradient-bg flex h-10 w-10 items-center justify-center rounded-full text-lg text-white">
            ⟳
          </span>
          <span className="font-display text-xl italic">Try on apparel</span>
          <span className="text-sm text-muted-foreground">
            See it on you first, with YouCam Virtual Try-On
          </span>
        </Link>
      </div>

      <Link href="/history" className={buttonVariants("ghost", "md")}>
        View your history →
      </Link>
    </main>
  );
}
