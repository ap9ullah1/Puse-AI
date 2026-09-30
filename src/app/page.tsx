import Link from "next/link";
import { Camera, Sparkles, Heart, ScanFace, Shirt, History } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card } from "@/components/ui/Card";
import { Logo } from "@/components/Logo";
import { PulseWave } from "@/components/PulseWave";

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

const CAPABILITIES = [
  {
    icon: ScanFace,
    title: "YouCam Skin AI",
    body: "Dermatology-grade analysis from one selfie.",
    points: [
      "8 concerns scored: texture, pore, wrinkle, acne, redness, oiliness, moisture, radiance",
      "Your 3 weakest scores surface as top concerns",
      "Matched to skincare that actually targets them",
    ],
  },
  {
    icon: Shirt,
    title: "YouCam Virtual Try-On",
    body: "See the fit before you spend a dollar.",
    points: [
      "Real outfits rendered from YouCam's official Clothes VTO templates",
      "Your photo, the garment, applied — not a mockup",
      "Compare the original and the result side by side",
    ],
  },
];

const PROOF = [
  { value: "8", label: "skin concerns scored per analysis" },
  { value: "2", label: "YouCam APIs integrated end-to-end" },
  { value: "100%", label: "of results saved to your session" },
];

const FAQ = [
  {
    q: "What photo works best?",
    a: "A clear, forward-facing selfie for skin analysis, filling most of the frame. For try-on, a full-body photo standing against a plain background. We show the exact guidance before you upload.",
  },
  {
    q: "Is my photo stored?",
    a: "No — only the resulting scores and try-on image are saved to your session, tied to an anonymous cookie, not the photo itself.",
  },
  {
    q: "What is the YouCam API?",
    a: "Perfect Corp's AI beauty and fashion platform — the same Skin AI and Virtual Try-On technology used by 800+ global beauty and fashion brands, on a standard REST API.",
  },
  {
    q: "Do I need an account?",
    a: "No. Everything is tracked to an anonymous session automatically. Revisit your past results anytime on the History page.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-24 px-6 py-20">
      <section className="flex flex-col items-center gap-6 text-center">


        <h1 className="font-display text-5xl italic leading-tight sm:text-6xl">
          Find your skin&apos;s <span className="pulse-gradient-text not-italic">pulse</span>
        </h1>

        <PulseWave className="h-10 w-full max-w-xs opacity-80" />

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
          <h2 className="font-display text-3xl italic">Two capabilities, one flow</h2>
          <p className="mt-2 text-muted-foreground">
            Not two disconnected demos — one selfie-driven shopping experience.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {CAPABILITIES.map((cap) => (
            <Card key={cap.title} className="flex flex-col gap-4 p-6">
              <span className="pulse-gradient-bg flex h-10 w-10 items-center justify-center rounded-full text-white">
                <cap.icon className="h-5 w-5" strokeWidth={2} />
              </span>
              <div>
                <h3 className="font-display text-xl italic">{cap.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{cap.body}</p>
              </div>
              <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                {cap.points.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span className="pulse-gradient-bg mt-2 h-1.5 w-1.5 shrink-0 rounded-full" />
                    {point}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
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

      <section className="rounded-[var(--radius)] border border-border bg-card p-10 shadow-[var(--shadow-soft)]">
        <div className="grid gap-8 sm:grid-cols-3">
          {PROOF.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1 text-center">
              <span className="pulse-gradient-text font-display text-4xl italic">
                {stat.value}
              </span>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-8">
        <div className="text-center">
          <h2 className="font-display text-3xl italic">Questions</h2>
        </div>

        <div className="mx-auto flex w-full max-w-2xl flex-col gap-3">
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="group rounded-[var(--radius)] border border-border bg-card p-5 shadow-[var(--shadow-soft)]"
            >
              <summary className="cursor-pointer list-none font-medium marker:content-none">
                <span className="flex items-center justify-between gap-4">
                  {item.q}
                  <span className="text-muted-foreground transition group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="flex flex-col items-center gap-6 rounded-[var(--radius)] p-12 text-center pulse-gradient-bg text-white">
        <h2 className="font-display text-3xl italic sm:text-4xl">Ready to find your pulse?</h2>
        <p className="max-w-md text-white/90">
          One selfie is all it takes to get real skin analysis and try on your next outfit.
        </p>
        <Link
          href="/analyze"
          className="rounded-full bg-white px-7 py-3.5 text-base font-medium text-foreground transition hover:brightness-95"
        >
          Get started
        </Link>
      </section>

      <footer className="flex flex-col items-center gap-4 border-t border-border pt-8 text-center text-sm text-muted-foreground">
        <Logo size={28} />
        <p>Puse — built for the YouCam API Skin AI &amp; eCommerce VTO Hackathon.</p>
        <div className="flex gap-4">
          <Link href="/analyze" className="flex items-center gap-1 hover:text-foreground">
            <Sparkles className="h-3.5 w-3.5" /> Skin AI
          </Link>
          <Link href="/catalog" className="flex items-center gap-1 hover:text-foreground">
            <Shirt className="h-3.5 w-3.5" /> Try On
          </Link>
          <Link href="/history" className="flex items-center gap-1 hover:text-foreground">
            <History className="h-3.5 w-3.5" /> History
          </Link>
        </div>
      </footer>
    </main>
  );
}
