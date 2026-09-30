import { config } from "dotenv";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

config({ path: ".env.local" });
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

// Skincare thumbnails render via <ProductThumb> (generated on-brand tiles) — no
// real product photography available yet, so `image` is intentionally unused.
const products = [
  {
    id: "barrier-repair-cream",
    kind: "skincare",
    name: "Barrier Repair Cream",
    price: 32,
    image: "",
    concern: "texture",
  },
  {
    id: "pore-refining-clay-mask",
    kind: "skincare",
    name: "Pore-Refining Clay Mask",
    price: 24,
    image: "",
    concern: "pore",
  },
  {
    id: "retinal-night-serum",
    kind: "skincare",
    name: "Retinal Night Serum",
    price: 48,
    image: "",
    concern: "wrinkle",
  },
  {
    id: "clearing-salicylic-gel",
    kind: "skincare",
    name: "Clearing Salicylic Gel",
    price: 22,
    image: "",
    concern: "acne",
  },
  {
    id: "calm-and-soothe-serum",
    kind: "skincare",
    name: "Calm & Soothe Serum",
    price: 29,
    image: "",
    concern: "redness",
  },
  {
    id: "mattifying-toner",
    kind: "skincare",
    name: "Mattifying Toner",
    price: 19,
    image: "",
    concern: "oiliness",
  },
  {
    id: "deep-hydration-gel",
    kind: "skincare",
    name: "Deep Hydration Gel",
    price: 27,
    image: "",
    concern: "moisture",
  },
  {
    id: "vitamin-c-brightening-drops",
    kind: "skincare",
    name: "Vitamin C Brightening Drops",
    price: 34,
    image: "",
    concern: "radiance",
  },
  // Apparel: each refImageUrl is a real, distinct, verified-working garment
  // photo — the official thumbnail of one of YouCam's predefined Clothes VTO
  // templates (GET /s2s/v2.0/task/template/cloth), not a shared placeholder.
  // Note: that endpoint's `template_id` is listing-only — the cloth-v4 task
  // itself only accepts ref_file_url/ref_file_id/src_file_url, confirmed by
  // testing template_id directly against the live API and having it rejected.
  {
    id: "white-shirt-and-jeans",
    kind: "apparel",
    name: "White Shirt & Jeans",
    price: 120,
    image: "https://app-cdn.makeupar.com/cms/54c04fb6-8a4c-454d-a75c-93500589c9aa/1773801599373/file.jpg",
    refImageUrl: "https://app-cdn.makeupar.com/cms/54c04fb6-8a4c-454d-a75c-93500589c9aa/1773801599373/file.jpg",
    garmentCategory: "auto",
  },
  {
    id: "denim-on-denim",
    kind: "apparel",
    name: "Denim on Denim",
    price: 135,
    image: "https://app-cdn.makeupar.com/cms/6ac3f7ef-3a24-4cc6-a80f-23c26b82c2e3/1773801653289/file.jpg",
    refImageUrl: "https://app-cdn.makeupar.com/cms/6ac3f7ef-3a24-4cc6-a80f-23c26b82c2e3/1773801653289/file.jpg",
    garmentCategory: "auto",
  },
  {
    id: "flowy-black-dress",
    kind: "apparel",
    name: "Flowy Black Dress",
    price: 98,
    image: "https://app-cdn.makeupar.com/cms/dde157f1-6585-44e2-93c1-621042286366/1773798871609/file.jpg",
    refImageUrl: "https://app-cdn.makeupar.com/cms/dde157f1-6585-44e2-93c1-621042286366/1773798871609/file.jpg",
    garmentCategory: "auto",
  },
  {
    id: "classic-black-suit",
    kind: "apparel",
    name: "Classic Black Suit",
    price: 249,
    image: "https://app-cdn.makeupar.com/cms/527fcbdf-eb50-4408-bc02-b05d2a74f154/1773801683794/file.jpg",
    refImageUrl: "https://app-cdn.makeupar.com/cms/527fcbdf-eb50-4408-bc02-b05d2a74f154/1773801683794/file.jpg",
    garmentCategory: "auto",
  },
];

async function main() {
  const currentIds = products.map((p) => p.id);
  await prisma.tryOnResult.deleteMany({ where: { productId: { notIn: currentIds } } });
  await prisma.product.deleteMany({ where: { id: { notIn: currentIds } } });

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
