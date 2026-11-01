import { config } from "dotenv";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

config({ path: ".env.local" });
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

const products = [
  // Skincare
  {
    id: "barrier-repair-cream",
    kind: "skincare",
    category: "skincare",
    name: "Barrier Repair Cream",
    description: "Ceramide-rich cream for rough texture and barrier recovery.",
    price: 32,
    image: "/images/skincare/barrier-repair-cream.jpg",
    concern: "texture",
    featured: true,
    stock: 40,
  },
  {
    id: "pore-refining-clay-mask",
    kind: "skincare",
    category: "skincare",
    name: "Pore-Refining Clay Mask",
    description: "Weekly clay treatment targeting enlarged pores.",
    price: 24,
    image: "/images/skincare/pore-refining-clay-mask.jpg",
    concern: "pore",
    featured: false,
    stock: 35,
  },
  {
    id: "retinal-night-serum",
    kind: "skincare",
    category: "skincare",
    name: "Retinal Night Serum",
    description: "Night serum for fine lines and early wrinkles.",
    price: 48,
    image: "/images/skincare/retinal-night-serum.jpg",
    concern: "wrinkle",
    featured: true,
    stock: 28,
  },
  {
    id: "clearing-salicylic-gel",
    kind: "skincare",
    category: "skincare",
    name: "Clearing Salicylic Gel",
    description: "Spot-clearing gel for acne-prone skin.",
    price: 22,
    image: "/images/skincare/clearing-salicylic-gel.jpg",
    concern: "acne",
    featured: false,
    stock: 45,
  },
  {
    id: "calm-and-soothe-serum",
    kind: "skincare",
    category: "skincare",
    name: "Calm & Soothe Serum",
    description: "Centella serum to ease redness and sensitivity.",
    price: 29,
    image: "/images/skincare/calm-and-soothe-serum.jpg",
    concern: "redness",
    featured: false,
    stock: 30,
  },
  {
    id: "mattifying-toner",
    kind: "skincare",
    category: "skincare",
    name: "Mattifying Toner",
    description: "Oil-control toner for midday shine.",
    price: 19,
    image: "/images/skincare/mattifying-toner.jpg",
    concern: "oiliness",
    featured: false,
    stock: 50,
  },
  {
    id: "deep-hydration-gel",
    kind: "skincare",
    category: "skincare",
    name: "Deep Hydration Gel",
    description: "Lightweight gel moisturizer for dry patches.",
    price: 27,
    image: "/images/skincare/deep-hydration-gel.jpg",
    concern: "moisture",
    featured: true,
    stock: 38,
  },
  {
    id: "vitamin-c-brightening-drops",
    kind: "skincare",
    category: "skincare",
    name: "Vitamin C Brightening Drops",
    description: "Radiance drops for dull, uneven tone.",
    price: 34,
    image: "/images/skincare/vitamin-c-brightening-drops.jpg",
    concern: "radiance",
    featured: true,
    stock: 32,
  },
  // Apparel with YouCam VTO
  {
    id: "white-shirt-and-jeans",
    kind: "apparel",
    category: "tops",
    name: "White Shirt & Jeans",
    description: "Classic everyday set — Clothes VTO ready.",
    price: 120,
    image: "https://app-cdn.makeupar.com/cms/54c04fb6-8a4c-454d-a75c-93500589c9aa/1773801599373/file.jpg",
    refImageUrl: "https://app-cdn.makeupar.com/cms/54c04fb6-8a4c-454d-a75c-93500589c9aa/1773801599373/file.jpg",
    garmentCategory: "auto",
    featured: true,
    stock: 18,
  },
  {
    id: "denim-on-denim",
    kind: "apparel",
    category: "denim",
    name: "Denim on Denim",
    description: "Layered denim look with virtual try-on.",
    price: 135,
    image: "https://app-cdn.makeupar.com/cms/6ac3f7ef-3a24-4cc6-a80f-23c26b82c2e3/1773801653289/file.jpg",
    refImageUrl: "https://app-cdn.makeupar.com/cms/6ac3f7ef-3a24-4cc6-a80f-23c26b82c2e3/1773801653289/file.jpg",
    garmentCategory: "auto",
    featured: true,
    stock: 15,
  },
  {
    id: "flowy-black-dress",
    kind: "apparel",
    category: "dresses",
    name: "Flowy Black Dress",
    description: "Occasion dress — see it on you with YouCam VTO.",
    price: 98,
    image: "https://app-cdn.makeupar.com/cms/dde157f1-6585-44e2-93c1-621042286366/1773798871609/file.jpg",
    refImageUrl: "https://app-cdn.makeupar.com/cms/dde157f1-6585-44e2-93c1-621042286366/1773798871609/file.jpg",
    garmentCategory: "auto",
    featured: true,
    stock: 22,
  },
  {
    id: "classic-black-suit",
    kind: "apparel",
    category: "suits",
    name: "Classic Black Suit",
    description: "Tailored black suit with full-body try-on.",
    price: 249,
    image: "https://app-cdn.makeupar.com/cms/527fcbdf-eb50-4408-bc02-b05d2a74f154/1773801683794/file.jpg",
    refImageUrl: "https://app-cdn.makeupar.com/cms/527fcbdf-eb50-4408-bc02-b05d2a74f154/1773801683794/file.jpg",
    garmentCategory: "auto",
    featured: true,
    stock: 10,
  },
  // Extra apparel / accessories (shop catalog — VTO where linked)
  {
    id: "relaxed-tee",
    kind: "apparel",
    category: "tops",
    name: "Relaxed Cotton Tee",
    description: "Soft everyday tee to layer under jackets.",
    price: 28,
    image: "/images/shop/tshirts.jpg",
    featured: false,
    stock: 60,
  },
  {
    id: "straight-jeans",
    kind: "apparel",
    category: "denim",
    name: "Straight Fit Jeans",
    description: "Clean straight denim for daily wear.",
    price: 68,
    image: "/images/shop/jeans.jpg",
    featured: false,
    stock: 40,
  },
  {
    id: "utility-jacket",
    kind: "apparel",
    category: "outerwear",
    name: "Utility Jacket",
    description: "Lightweight jacket to finish a try-on look.",
    price: 89,
    image: "/images/shop/jackets.jpg",
    featured: true,
    stock: 20,
  },
  {
    id: "city-sneakers",
    kind: "accessory",
    category: "footwear",
    name: "City Sneakers",
    description: "Minimal sneakers for skincare-run errands and VTO shoots.",
    price: 79,
    image: "/images/shop/shoes.jpg",
    featured: true,
    stock: 25,
  },
  {
    id: "crossbody-bag",
    kind: "accessory",
    category: "accessories",
    name: "Crossbody Bag",
    description: "Compact bag for day-to-night outfits.",
    price: 54,
    image: "/images/shop/bags.jpg",
    featured: false,
    stock: 30,
  },
  {
    id: "clear-frame-glasses",
    kind: "accessory",
    category: "accessories",
    name: "Clear Frame Glasses",
    description: "Lightweight frames — style the face after Skin AI.",
    price: 42,
    image: "/images/shop/glasses.png",
    featured: false,
    stock: 35,
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
