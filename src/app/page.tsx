import Link from "next/link";
import { Camera, Sparkles, Heart, ScanFace, Shirt, History } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card } from "@/components/ui/Card";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { Logo } from "@/components/Logo";
import { PulseWave } from "@/components/PulseWave";
import { Reveal } from "@/components/Reveal";

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

const SAMPLE_SCORES = [
  { type: "moisture", score: 74 },
  { type: "redness", score: 82 },
  { type: "texture", score: 68 },
];

const OUTFIT_PHOTOS = [
  "https://app-cdn.makeupar.com/cms/dde157f1-6585-44e2-93c1-621042286366/1773798871609/file.jpg",
  "https://app-cdn.makeupar.com/cms/54c04fb6-8a4c-454d-a75c-93500589c9aa/1773801599373/file.jpg",
];

function AnalysisMockup() {
  return (
    <Card className="flex w-full max-w-sm flex-col gap-5 p-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">Sample analysis</span>
        <span className="pulse-gradient-bg pulse-ring h-2 w-2 rounded-full" />
      </div>
      <div className="flex justify-between">
        {SAMPLE_SCORES.map((s) => (
          <ScoreRing key={s.type} score={s.score} label={s.type} size={76} />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Real output shape from YouCam Skin AI — scored live from your own selfie.
      </p>
    </Card>
  );
}

function OutfitMockup() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={OUTFIT_PHOTOS[0]}
        alt="Flowy Black Dress, a real YouCam Clothes VTO template"
        className="h-80 w-56 rounded-[var(--radius)] object-cover shadow-[var(--shadow-soft)] transition duration-500 hover:scale-[1.02]"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={OUTFIT_PHOTOS[1]}
        alt="White Shirt & Jeans, a real YouCam Clothes VTO template"
        className="absolute -bottom-8 -right-6 h-56 w-40 rotate-3 rounded-[var(--radius)] border-4 border-background object-cover shadow-[var(--shadow-soft)] transition duration-500 hover:rotate-0"
      />
    </div>
  );
}

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-28 px-6 py-16 sm:px-10">
      <section className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal className="flex flex-col items-start gap-6">
          <h1 className="font-display text-5xl italic leading-tight sm:text-6xl">
            Find your skin&apos;s <span className="pulse-gradient-text not-italic">pulse</span>
          </h1>

          <PulseWave className="h-8 w-64" />

          <p className="max-w-lg text-lg text-muted-foreground">
            Upload a selfie for a real AI skin analysis, get matched to skincare that actually
            targets your concerns, and try on apparel before you buy — powered by YouCam Skin AI
            and Virtual Try-On.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/analyze" className={buttonVariants("primary", "lg")}>
              Analyze my skin
            </Link>
            <Link href="/catalog" className={buttonVariants("outline", "lg")}>
              Try on apparel
            </Link>
          </div>

          <Link href="/history" className={buttonVariants("ghost", "md")}>
            View your history →
          </Link>
        </Reveal>

        <Reveal delay={150} className="flex justify-center lg:justify-end">
          <AnalysisMockup />
        </Reveal>
      </section>

      <section className="flex flex-col gap-16">
        <Reveal className="max-w-xl">
          <h2 className="font-display text-3xl italic">Two capabilities, one flow</h2>
          <p className="mt-2 text-muted-foreground">
            Not two disconnected demos — one selfie-driven shopping experience.
          </p>
        </Reveal>

        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal className="flex flex-col items-start gap-4">
            <span className="pulse-gradient-bg flex h-11 w-11 items-center justify-center rounded-full text-white">
              <ScanFace className="h-5 w-5" strokeWidth={2} />
            </span>
            <h3 className="font-display text-2xl italic">YouCam Skin AI</h3>
            <p className="text-muted-foreground">Dermatology-grade analysis from one selfie.</p>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              {[
                "8 concerns scored: texture, pore, wrinkle, acne, redness, oiliness, moisture, radiance",
                "Your 3 weakest scores surface as top concerns",
                "Matched to skincare that actually targets them",
              ].map((point) => (
                <li key={point} className="flex gap-2">
                  <span className="pulse-gradient-bg mt-2 h-1.5 w-1.5 shrink-0 rounded-full" />
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={150} className="flex justify-center">
            <AnalysisMockup />
          </Reveal>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal className="order-2 flex justify-center lg:order-1">
            <OutfitMockup />
          </Reveal>
          <Reveal delay={150} className="order-1 flex flex-col items-start gap-4 lg:order-2">
            <span className="pulse-gradient-bg flex h-11 w-11 items-center justify-center rounded-full text-white">
              <Shirt className="h-5 w-5" strokeWidth={2} />
            </span>
            <h3 className="font-display text-2xl italic">YouCam Virtual Try-On</h3>
            <p className="text-muted-foreground">See the fit before you spend a dollar.</p>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              {[
                "Real outfits rendered from YouCam's official Clothes VTO templates",
                "Your photo, the garment, applied — not a mockup",
                "Compare the original and the result side by side",
              ].map((point) => (
                <li key={point} className="flex gap-2">
                  <span className="pulse-gradient-bg mt-2 h-1.5 w-1.5 shrink-0 rounded-full" />
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="flex flex-col gap-8">
        <Reveal className="max-w-xl">
          <h2 className="font-display text-3xl italic">How it works</h2>
          <p className="mt-2 text-muted-foreground">One photo in, real answers out.</p>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 100}>
              <Card className="flex h-full flex-col gap-3 p-6 transition hover:-translate-y-1">
                <div className="flex items-center gap-3">
                  <span className="pulse-gradient-bg flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white">
                    <step.icon className="h-4 w-4" strokeWidth={2} />
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">Step {i + 1}</span>
                </div>
                <h3 className="font-display text-lg italic">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal>
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
      </Reveal>

      <section className="grid gap-10 lg:grid-cols-[1fr_2fr]">
        <Reveal>
          <h2 className="font-display text-3xl italic">Questions</h2>
        </Reveal>

        <div className="grid gap-3 sm:grid-cols-2">
          {FAQ.map((item, i) => (
            <Reveal key={item.q} delay={i * 80}>
              <details className="group h-full rounded-[var(--radius)] border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
                <summary className="cursor-pointer list-none font-medium marker:content-none">
                  <span className="flex items-center justify-between gap-4">
                    {item.q}
                    <span className="text-muted-foreground transition group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{item.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal>
        <section className="flex flex-col items-center gap-6 rounded-[var(--radius)] bg-foreground p-12 text-center sm:p-16">
          <h2 className="font-display text-3xl italic text-background sm:text-4xl">
            Ready to find your{" "}
            <span className="pulse-gradient-text not-italic">pulse</span>?
          </h2>
          <p className="max-w-md text-background/70">
            One selfie is all it takes to get real skin analysis and try on your next outfit.
          </p>
          <Link href="/analyze" className={buttonVariants("primary", "lg")}>
            Get started
          </Link>
        </section>
      </Reveal>

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
