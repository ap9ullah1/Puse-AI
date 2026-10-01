import { prisma } from "@/lib/db";
import type { Product } from "@/lib/products";
import { getAllProducts } from "@/lib/products";

export type AgentAction = {
  label: string;
  href: string;
};

export type AgentProductCard = {
  id: string;
  name: string;
  price: number;
  image: string;
  kind: "skincare" | "apparel";
  concern?: string | null;
};

export type AgentReply = {
  reply: string;
  products: AgentProductCard[];
  actions: AgentAction[];
};

function toCard(p: Product): AgentProductCard {
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image,
    kind: p.kind,
    concern: "concern" in p ? p.concern : null,
  };
}

function includesAny(text: string, words: string[]): boolean {
  return words.some((w) => text.includes(w));
}

/** Rule-based shop agent — uses Skin AI history + catalog (YouCam-first, no third-party LLM required). */
export async function runShopAgent(input: {
  message: string;
  sessionId: string | null;
  userId: string | null;
}): Promise<AgentReply> {
  const message = input.message.trim().toLowerCase();
  const products = await getAllProducts();
  const skincare = products.filter((p) => p.kind === "skincare");
  const apparel = products.filter((p) => p.kind === "apparel");

  const latestSkin = input.userId
    ? await prisma.skinAnalysisResult.findFirst({
        where: { userId: input.userId },
        orderBy: { createdAt: "desc" },
      })
    : input.sessionId
      ? await prisma.skinAnalysisResult.findFirst({
          where: { sessionId: input.sessionId },
          orderBy: { createdAt: "desc" },
        })
      : null;

  let topConcerns: string[] = [];
  if (latestSkin) {
    try {
      const parsed = JSON.parse(latestSkin.concerns) as { type: string; ui_score: number }[];
      topConcerns = [...parsed]
        .sort((a, b) => a.ui_score - b.ui_score)
        .slice(0, 3)
        .map((c) => c.type);
    } catch {
      topConcerns = [];
    }
  }

  // Greetings / help
  if (
    !message ||
    includesAny(message, ["hi", "hello", "hey", "help", "what can", "who are"])
  ) {
    return {
      reply:
        "I’m the Puse shop agent. I can match skincare from your YouCam Skin AI scores, point you to Clothes VTO try-ons, and drop products in your bag. Try: “match my skin”, “try on a dress”, or “show apparel”.",
      products: [],
      actions: [
        { label: "Run Skin AI", href: "/analyze" },
        { label: "Shop catalog", href: "/catalog" },
        { label: "Open bag", href: "/bag" },
      ],
    };
  }

  // Skin match from last analysis
  if (
    includesAny(message, [
      "match my skin",
      "my skin",
      "skin result",
      "based on my",
      "recommend for me",
      "for my concerns",
      "weakest",
    ]) ||
    (includesAny(message, ["recommend", "suggest", "match"]) &&
      includesAny(message, ["skin", "face", "concern"]))
  ) {
    if (topConcerns.length === 0) {
      return {
        reply:
          "I don’t have a Skin AI scan for you yet. Run YouCam Skin Analysis first — I’ll chain your weakest scores straight into product matches.",
        products: [],
        actions: [{ label: "Start Skin AI", href: "/analyze" }],
      };
    }
    const matched = skincare.filter((p) => topConcerns.includes(p.concern)).map(toCard);
    return {
      reply: `From your latest YouCam Skin AI scan, your priority concerns are ${topConcerns.join(", ")}. Here are SKUs tagged to those scores — add any to your bag or open the product page.`,
      products: matched.slice(0, 4),
      actions: [
        { label: "Re-scan skin", href: "/analyze" },
        { label: "View bag", href: "/bag" },
      ],
    };
  }

  // Concern-specific skincare
  const concernHints: { words: string[]; concern: string }[] = [
    { words: ["pore", "pores"], concern: "pore" },
    { words: ["wrinkle", "aging", "anti-age"], concern: "wrinkle" },
    { words: ["acne", "pimple", "breakout"], concern: "acne" },
    { words: ["redness", "sensitive", "calm"], concern: "redness" },
    { words: ["oil", "oily", "shine", "mattif"], concern: "oiliness" },
    { words: ["dry", "hydrat", "moisture"], concern: "moisture" },
    { words: ["dull", "bright", "radiance", "vitamin c", "glow"], concern: "radiance" },
    { words: ["texture", "barrier", "rough"], concern: "texture" },
  ];
  for (const hint of concernHints) {
    if (includesAny(message, hint.words)) {
      const matched = skincare.filter((p) => p.concern === hint.concern).map(toCard);
      return {
        reply: `For ${hint.concern}, here’s what we stock — matched the same way Skin AI concern→SKU chaining works after a scan.`,
        products: matched,
        actions: [
          { label: "Full Skin AI scan", href: "/analyze" },
          { label: "All skincare", href: "/catalog" },
        ],
      };
    }
  }

  // Try-on / apparel
  if (
    includesAny(message, [
      "try on",
      "vto",
      "virtual",
      "outfit",
      "dress",
      "suit",
      "jeans",
      "shirt",
      "apparel",
      "clothes",
      "fashion",
      "wear",
    ])
  ) {
    let picks = apparel;
    if (includesAny(message, ["dress"])) {
      picks = apparel.filter((p) => p.name.toLowerCase().includes("dress"));
    } else if (includesAny(message, ["suit"])) {
      picks = apparel.filter((p) => p.name.toLowerCase().includes("suit"));
    } else if (includesAny(message, ["jean", "denim"])) {
      picks = apparel.filter((p) => /jean|denim/i.test(p.name));
    } else if (includesAny(message, ["shirt"])) {
      picks = apparel.filter((p) => p.name.toLowerCase().includes("shirt"));
    }
    if (picks.length === 0) picks = apparel;
    return {
      reply:
        "Apparel uses YouCam Clothes Virtual Try-On (cloth-v4). Pick a look, upload a full-body photo, then add the rendered look to your bag.",
      products: picks.slice(0, 4).map(toCard),
      actions: [
        { label: "Open shop", href: "/catalog" },
        {
          label: "Try first item",
          href: `/try-on/${picks[0]?.id ?? apparel[0]?.id}`,
        },
      ],
    };
  }

  // Bag / checkout
  if (includesAny(message, ["bag", "cart", "checkout", "buy", "purchase", "order"])) {
    return {
      reply:
        "Your bag holds Skin AI matches and VTO looks together — then demo checkout closes the ecommerce loop (no real charge).",
      products: [],
      actions: [
        { label: "Open bag", href: "/bag" },
        { label: "Keep shopping", href: "/catalog" },
      ],
    };
  }

  // Skincare browse
  if (includesAny(message, ["skincare", "serum", "cream", "toner", "mask", "product"])) {
    return {
      reply: "Here’s our skincare shelf. Best results: run Skin AI first so recommendations use your real YouCam scores.",
      products: skincare.slice(0, 4).map(toCard),
      actions: [
        { label: "Skin AI", href: "/analyze" },
        { label: "Full catalog", href: "/catalog" },
      ],
    };
  }

  // Fallback: mix featured
  return {
    reply:
      "I can help with Skin AI matches, skincare by concern, or Clothes VTO try-ons. Ask “match my skin”, “something for pores”, or “try on a suit”.",
    products: [...skincare.slice(0, 2), ...apparel.slice(0, 2)].map(toCard),
    actions: [
      { label: "Skin AI", href: "/analyze" },
      { label: "Shop", href: "/catalog" },
    ],
  };
}
