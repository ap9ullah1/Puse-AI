import { prisma } from "./db";
import type { Product as ProductRow } from "@/generated/prisma/client";
import type { GarmentCategory } from "./youcam/client";

export type SkinConcernType =
  | "wrinkle"
  | "pore"
  | "texture"
  | "acne"
  | "redness"
  | "oiliness"
  | "moisture"
  | "radiance";

export type ProductKind = "skincare" | "apparel" | "accessory";

export type ProductBase = {
  id: string;
  kind: ProductKind;
  category: string;
  name: string;
  description: string;
  price: number;
  image: string;
  featured: boolean;
  stock: number;
};

export type SkincareProduct = ProductBase & {
  kind: "skincare";
  concern: SkinConcernType;
};

export type ApparelProduct = ProductBase & {
  kind: "apparel";
  concern?: null;
  refImageUrl?: string | null;
  garmentCategory?: GarmentCategory | null;
};

export type AccessoryProduct = ProductBase & {
  kind: "accessory";
};

export type Product = SkincareProduct | ApparelProduct | AccessoryProduct;

export function isApparelProduct(product: Product): product is ApparelProduct {
  return product.kind === "apparel";
}

export function canTryOn(product: Product): product is ApparelProduct & { refImageUrl: string } {
  return product.kind === "apparel" && Boolean(product.refImageUrl);
}

function toProduct(row: ProductRow): Product {
  const base = {
    id: row.id,
    category: row.category,
    name: row.name,
    description: row.description,
    price: row.price,
    image: row.image,
    featured: row.featured,
    stock: row.stock,
  };

  if (row.kind === "skincare") {
    if (!row.concern) throw new Error(`Skincare product "${row.id}" is missing concern`);
    return {
      ...base,
      kind: "skincare",
      concern: row.concern as SkinConcernType,
    };
  }

  if (row.kind === "accessory") {
    return { ...base, kind: "accessory" };
  }

  return {
    ...base,
    kind: "apparel",
    refImageUrl: row.refImageUrl,
    garmentCategory: (row.garmentCategory as GarmentCategory | null) ?? null,
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({ orderBy: [{ featured: "desc" }, { name: "asc" }] });
  return rows.map(toProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  const row = await prisma.product.findUnique({ where: { id } });
  return row ? toProduct(row) : null;
}

export async function getApparelProductById(
  id: string
): Promise<(ApparelProduct & { refImageUrl: string }) | null> {
  const product = await getProductById(id);
  if (!product || !isApparelProduct(product) || !product.refImageUrl) return null;
  return product as ApparelProduct & { refImageUrl: string };
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { category },
    orderBy: { name: "asc" },
  });
  return rows.map(toProduct);
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { featured: true },
    take: limit,
    orderBy: { name: "asc" },
  });
  return rows.map(toProduct);
}

export const SHOP_CATEGORIES = [
  {
    slug: "skincare",
    name: "Skincare",
    blurb: "Matched to YouCam Skin AI scores",
    image: "/images/skincare/vitamin-c-brightening-drops.jpg",
  },
  {
    slug: "tops",
    name: "Tops",
    blurb: "Shirts & tees — try on selected styles",
    image: "/images/shop/tshirts.jpg",
  },
  {
    slug: "denim",
    name: "Denim",
    blurb: "Jeans & denim sets",
    image: "/images/shop/jeans.jpg",
  },
  {
    slug: "dresses",
    name: "Dresses",
    blurb: "Virtual try-on ready",
    image: "/images/shop/dresses.jpg",
  },
  {
    slug: "outerwear",
    name: "Outerwear",
    blurb: "Jackets for the full look",
    image: "/images/shop/jackets.jpg",
  },
  {
    slug: "footwear",
    name: "Footwear",
    blurb: "Finish the outfit",
    image: "/images/shop/shoes.jpg",
  },
  {
    slug: "accessories",
    name: "Accessories",
    blurb: "Bags, glasses & more",
    image: "/images/shop/bags.jpg",
  },
  {
    slug: "suits",
    name: "Suits",
    blurb: "Formal looks with VTO",
    image: "/images/shop/suits.jpg",
  },
] as const;

export type ShopCategorySlug = (typeof SHOP_CATEGORIES)[number]["slug"];
