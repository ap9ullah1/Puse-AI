import { config } from "dotenv";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

config({ path: ".env.local" });
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

const DEMO_GARMENT_REF_IMAGE =
  "https://plugins-media.makeupar.com/strapi/assets/clothes_reference_full_body_01_5a000d999f.png";

const products = [
  {
    id: "barrier-repair-cream",
    kind: "skincare",
    name: "Barrier Repair Cream",
    price: 32,
    image: "https://picsum.photos/seed/barrier-repair-cream/480/640",
    concern: "texture",
  },
  {
    id: "pore-refining-clay-mask",
    kind: "skincare",
    name: "Pore-Refining Clay Mask",
    price: 24,
    image: "https://picsum.photos/seed/pore-refining-clay-mask/480/640",
    concern: "pore",
  },
  {
    id: "retinal-night-serum",
    kind: "skincare",
    name: "Retinal Night Serum",
    price: 48,
    image: "https://picsum.photos/seed/retinal-night-serum/480/640",
    concern: "wrinkle",
  },
  {
    id: "clearing-salicylic-gel",
    kind: "skincare",
    name: "Clearing Salicylic Gel",
    price: 22,
    image: "https://picsum.photos/seed/clearing-salicylic-gel/480/640",
    concern: "acne",
  },
  {
    id: "calm-and-soothe-serum",
    kind: "skincare",
    name: "Calm & Soothe Serum",
    price: 29,
    image: "https://picsum.photos/seed/calm-and-soothe-serum/480/640",
    concern: "redness",
  },
  {
    id: "mattifying-toner",
    kind: "skincare",
    name: "Mattifying Toner",
    price: 19,
    image: "https://picsum.photos/seed/mattifying-toner/480/640",
    concern: "oiliness",
  },
  {
    id: "deep-hydration-gel",
    kind: "skincare",
    name: "Deep Hydration Gel",
    price: 27,
    image: "https://picsum.photos/seed/deep-hydration-gel/480/640",
    concern: "moisture",
  },
  {
    id: "vitamin-c-brightening-drops",
    kind: "skincare",
    name: "Vitamin C Brightening Drops",
    price: 34,
    image: "https://picsum.photos/seed/vitamin-c-brightening-drops/480/640",
    concern: "radiance",
  },
  {
    id: "everyday-oxford-shirt",
    kind: "apparel",
    name: "Everyday Oxford Shirt",
    price: 58,
    image: "https://picsum.photos/seed/everyday-oxford-shirt/480/640",
    refImageUrl: DEMO_GARMENT_REF_IMAGE,
    garmentCategory: "upper_body",
  },
  {
    id: "tailored-wide-leg-trouser",
    kind: "apparel",
    name: "Tailored Wide-Leg Trouser",
    price: 74,
    image: "https://picsum.photos/seed/tailored-wide-leg-trouser/480/640",
    refImageUrl: DEMO_GARMENT_REF_IMAGE,
    garmentCategory: "lower_body",
  },
  {
    id: "studio-midi-dress",
    kind: "apparel",
    name: "Studio Midi Dress",
    price: 89,
    image: "https://picsum.photos/seed/studio-midi-dress/480/640",
    refImageUrl: DEMO_GARMENT_REF_IMAGE,
    garmentCategory: "full_body",
  },
  {
    id: "cropped-utility-jacket",
    kind: "apparel",
    name: "Cropped Utility Jacket",
    price: 96,
    image: "https://picsum.photos/seed/cropped-utility-jacket/480/640",
    refImageUrl: DEMO_GARMENT_REF_IMAGE,
    garmentCategory: "outerwear",
  },
];

async function main() {
  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      create: product,
      update: product,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
