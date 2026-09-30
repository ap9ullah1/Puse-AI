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

export type SkincareProduct = {
  id: string;
  kind: "skincare";
  name: string;
  price: number;
  image: string;
  concern: SkinConcernType;
};

export type ApparelProduct = {
  id: string;
  kind: "apparel";
  name: string;
  price: number;
  image: string;
  refImageUrl: string;
  garmentCategory: GarmentCategory;
};

export type Product = SkincareProduct | ApparelProduct;

export function isApparelProduct(product: Product): product is ApparelProduct {
  return product.kind === "apparel";
}

function toProduct(row: ProductRow): Product {
  if (row.kind === "apparel") {
    if (!row.refImageUrl || !row.garmentCategory) {
      throw new Error(`Apparel product "${row.id}" is missing refImageUrl or garmentCategory`);
    }
    return {
      id: row.id,
      kind: "apparel",
      name: row.name,
      price: row.price,
      image: row.image,
      refImageUrl: row.refImageUrl,
      garmentCategory: row.garmentCategory as GarmentCategory,
    };
  }

  if (!row.concern) {
    throw new Error(`Skincare product "${row.id}" is missing concern`);
  }
  return {
    id: row.id,
    kind: "skincare",
    name: row.name,
    price: row.price,
    image: row.image,
    concern: row.concern as SkinConcernType,
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({ orderBy: { name: "asc" } });
  return rows.map(toProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  const row = await prisma.product.findUnique({ where: { id } });
  return row ? toProduct(row) : null;
}

export async function getApparelProductById(id: string): Promise<ApparelProduct | null> {
  const product = await getProductById(id);
  if (!product || !isApparelProduct(product)) return null;
  return product;
}
