import Link from "next/link";
import { Camera, Sparkles, Heart, ScanFace, Shirt } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card } from "@/components/ui/Card";
import { FaqAccordion, type FaqItem } from "@/components/FaqAccordion";
import { Reveal } from "@/components/Reveal";

const STEPS = [
  {
    icon: Camera,
    title: "Diagnose",
    body: "Upload a selfie — YouCam Skin AI scores eight real skin concerns.",
  },
  {
    icon: Sparkles,
    title: "Match",
    body: "Get skincare matched to your weakest scores — not a generic bestseller list.",
  },
  {
    icon: Shirt,
    title: "Try on",
    body: "Upload a full-body shot and see apparel on you with YouCam Clothes VTO.",
  },
  {
    icon: Heart,
    title: "Buy",
    body: "Add Skin AI matches and try-on looks to one bag, then check out.",
  },
];

const PROOF = [
  { value: "8", label: "skin concerns scored per analysis" },
  { value: "2", label: "YouCam APIs integrated end-to-end" },
  { value: "100%", label: "of results saved to your session" },
];

const FAQ: FaqItem[] = [
  {
    q: "What photo works best?",
    a: "For Skin AI, use a clear forward-facing selfie that fills most of the frame in even light. For apparel try-on, stand full-body against a plain background with your feet in frame. We show the exact guidance before every upload.",
    icon: "photo",
  },
  {
    q: "Is my photo stored?",
    a: "No. We keep the Skin AI scores and the try-on result image in your session — not the original photo. Guest results are tied to an anonymous cookie until you sign in and import them.",
    icon: "privacy",
  },
  {
    q: "What powers the analysis and try-on?",
    a: "YouCam Skin AI and Clothes Virtual Try-On from Perfect Corp — the same APIs used by 800+ beauty and fashion brands. Scores and garment renders come from live API calls, not mockups.",
    icon: "api",
  },
  {
    q: "How does checkout work?",
    a: "Add Skin AI matches and try-on looks to one bag, pick sizes, choose standard or express shipping, and place the order. Track it anytime under Orders.",
    icon: "checkout",
  },
  {
    q: "Do I need an account?",
    a: "No — you can shop as a guest. Create an account to keep Skin AI results, try-ons, and orders across devices.",
    icon: "account",
  },
  {
    q: "Are there shopper codes?",
    a: "Yes. Use PUSE10 for 10% off, SKINAI for 15%, or TRYON for 12%. Enter a code in your bag before checkout. Standard shipping is free over $100 after discount.",
    icon: "codes",
  },
];

const OUTFIT_PHOTOS = [
  "https://app-cdn.makeupar.com/cms/dde157f1-6585-44e2-93c1-621042286366/1773798871609/file.jpg",
  "https://app-cdn.makeupar.com/cms/54c04fb6-8a4c-454d-a75c-93500589c9aa/1773801599373/file.jpg",
];

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
          <span className="suite-tag">YouCam × Puse AI</span>
          <h1 className="font-display text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
            <span className="puse-gradient-text">Puse AI</span> skin &amp; style shop
          </h1>

          <p className="max-w-lg text-lg text-muted-foreground">
            Upload a selfie for a real AI skin analysis, get matched to skincare that actually
            targets your concerns, and try on apparel before you buy — powered by YouCam Skin AI
            and Virtual Try-On.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/analyze" className={buttonVariants("primary", "lg")}>
              Diagnose my skin
            </Link>
            <Link href="/catalog" className={buttonVariants("outline", "lg")}>
              Shop & try on
            </Link>
          </div>

          <Link href="/bag" className={buttonVariants("ghost", "md")}>
            View bag →
          </Link>
        </Reveal>

        <Reveal delay={150} className="flex justify-center lg:justify-end">
          <div className="overflow-hidden rounded-[1.5rem] border border-border bg-white shadow-[var(--shadow-soft)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/AI%20Beauty%20Features%20Showcase.png"
              alt="Skin analysis, virtual try-on, beauty, and checkout"
              className="w-full max-w-xl"
            />
          </div>
        </Reveal>
      </section>

      <section className="flex flex-col gap-8">
        <Reveal className="max-w-xl">
          <p className="suite-tag">Shop</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">
            Explore the store
          </h2>
          <p className="mt-2 text-muted-foreground">
            Skin AI, apparel VTO, and checkout — one Puse AI experience.
          </p>
        </Reveal>
        <Reveal delay={80}>
          <Link
            href="/catalog"
            className="group block overflow-hidden rounded-[1.5rem] border border-border bg-white shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:border-accent-solid/40"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/Puse%20AI%20Shop_%20Beauty%20Meets%20Style.png"
              alt="Puse shop — Skin AI, matched skincare, apparel try-on, and your bag"
              className="w-full transition duration-500 group-hover:scale-[1.01]"
            />
          </Link>
        </Reveal>
        <Reveal>
          <div className="flex flex-wrap gap-2">
            <Link href="/analyze" className={buttonVariants("outline", "md")}>
              Skin AI
            </Link>
            <Link href="/shop/category/skincare" className={buttonVariants("outline", "md")}>
              Skincare
            </Link>
            <Link href="/catalog?vto=1" className={buttonVariants("outline", "md")}>
              Apparel VTO
            </Link>
            <Link href="/bag" className={buttonVariants("outline", "md")}>
              Your bag
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Need a hand? Open the{" "}
            <span className="text-accent-solid">shop agent</span> (chat bubble) — it chains Skin AI
            scores to SKUs and starts try-ons.
          </p>
        </Reveal>
      </section>

      <section className="flex flex-col gap-16">
        <Reveal className="max-w-xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight">
            Two capabilities, <span className="suite-title-band">one flow</span>
          </h2>
          <p className="mt-2 text-muted-foreground">
            Not two disconnected demos — one selfie-driven shopping experience.
          </p>
        </Reveal>

        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal className="flex flex-col items-start gap-4">
            <span className="puse-gradient-bg flex h-11 w-11 items-center justify-center rounded-full text-[var(--accent-solid-foreground)]">
              <ScanFace className="h-5 w-5" strokeWidth={2} />
            </span>
            <h3 className="font-display text-2xl font-semibold tracking-tight">YouCam Skin AI</h3>
            <p className="text-muted-foreground">Dermatology-grade analysis from one selfie.</p>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              {[
                "8 concerns scored: texture, pore, wrinkle, acne, redness, oiliness, moisture, radiance",
                "Your 3 weakest scores surface as top concerns",
                "Matched to skincare that actually targets them",
              ].map((point) => (
                <li key={point} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-solid" />
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={150} className="flex justify-center">
            <div className="overflow-hidden rounded-[1.5rem] border border-border bg-white shadow-[var(--shadow-soft)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/puse-ai-personalized-recommendations.svg"
                alt="Personalized skincare picks matched to a skin profile"
                className="w-full max-w-md"
              />
            </div>
          </Reveal>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal className="order-2 flex justify-center lg:order-1">
            <OutfitMockup />
          </Reveal>
          <Reveal delay={150} className="order-1 flex flex-col items-start gap-4 lg:order-2">
            <span className="puse-gradient-bg flex h-11 w-11 items-center justify-center rounded-full text-[var(--accent-solid-foreground)]">
              <Shirt className="h-5 w-5" strokeWidth={2} />
            </span>
            <h3 className="font-display text-2xl font-semibold tracking-tight">
              YouCam Virtual Try-On
            </h3>
            <p className="text-muted-foreground">See the fit before you spend a dollar.</p>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              {[
                "Real outfits rendered from YouCam's official Clothes VTO templates",
                "Your photo, the garment, applied — not a mockup",
                "Compare the original and the result side by side",
              ].map((point) => (
                <li key={point} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-solid" />
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="flex flex-col gap-8">
        <Reveal className="max-w-xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight">How it works</h2>
          <p className="mt-2 text-muted-foreground">One photo in, real answers out.</p>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 100}>
              <Card className="flex h-full flex-col gap-3 p-6 transition hover:-translate-y-1 hover:border-accent-solid/30">
                <div className="flex items-center gap-3">
                  <span className="puse-gradient-bg flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--accent-solid-foreground)]">
                    <step.icon className="h-4 w-4" strokeWidth={2} />
                  </span>
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Step {i + 1}
                  </span>
                </div>
                <h3 className="font-display text-lg font-semibold">{step.title}</h3>
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
                <span className="puse-gradient-text font-display text-4xl font-semibold">
                  {stat.value}
                </span>
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <section className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)]">
        <Reveal className="flex flex-col gap-4 lg:sticky lg:top-28">
          <p className="suite-tag">FAQ</p>
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Questions, <span className="puse-gradient-text">answered</span>
          </h2>
          <p className="max-w-sm text-muted-foreground">
            Photos, privacy, YouCam, checkout, and codes — everything you need before your first
            selfie.
          </p>
          <p className="text-sm text-muted-foreground">
            Still stuck? Open the{" "}
            <span className="font-medium text-accent-solid">shop agent</span> in the corner — it can
            start Skin AI or a try-on from chat.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <FaqAccordion items={FAQ} />
        </Reveal>
      </section>

      <Reveal>
        <section className="flex flex-col items-center gap-6 rounded-[var(--radius)] border border-accent-solid/20 bg-card p-12 text-center sm:p-16">
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Ready to shop with <span className="puse-gradient-text">Puse AI</span>?
          </h2>
          <p className="max-w-md text-muted-foreground">
            One selfie is all it takes to get real skin analysis and try on your next outfit.
          </p>
          <Link href="/analyze" className={buttonVariants("primary", "lg")}>
            Get started
          </Link>
        </section>
      </Reveal>

    </main>
  );
}
