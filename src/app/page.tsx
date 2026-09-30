import Link from "next/link";
import { Camera, Sparkles, Heart } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card } from "@/components/ui/Card";

const STEPS = [
  {
    icon: Camera,
    title: "Upload a photo",
    body: "A selfie for skin analysis, or a full-body shot to try on apparel.",
  },
  {
    icon: Sparkles,
    title: "YouCam AI does its thing",
    body: "Real dermatology-grade skin scoring, or a generative outfit render — in seconds.",
  },
  {
    icon: Heart,
    title: "Get matched",
    body: "See your top concerns and the products that target them, or see yourself in the outfit.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-24 px-6 py-20">
      <section className="flex flex-col items-center gap-6 text-center">
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

        <div className="grid w-full gap-4 pt-4 sm:grid-cols-2">
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
      </section>

      <section className="flex flex-col gap-8">
        <div className="text-center">
          <h2 className="font-display text-3xl italic">How it works</h2>
          <p className="mt-2 text-muted-foreground">One photo in, real answers out.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <Card key={step.title} className="flex flex-col gap-3 p-6">
              <div className="flex items-center gap-3">
                <span className="pulse-gradient-bg flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white">
                  <step.icon className="h-4 w-4" strokeWidth={2} />
                </span>
                <span className="text-xs font-medium text-muted-foreground">Step {i + 1}</span>
              </div>
              <h3 className="font-display text-lg italic">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <footer className="flex flex-col items-center gap-2 border-t border-border pt-8 text-center text-sm text-muted-foreground">
        <p>Puse — built for the YouCam API Skin AI & eCommerce VTO Hackathon.</p>
        <div className="flex gap-4">
          <Link href="/analyze" className="hover:text-foreground">
            Skin AI
          </Link>
          <Link href="/catalog" className="hover:text-foreground">
            Try On
          </Link>
          <Link href="/history" className="hover:text-foreground">
            History
          </Link>
        </div>
      </footer>
    </main>
  );
}
