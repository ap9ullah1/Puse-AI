import { NextResponse } from "next/server";
import { createClothTryOnTask } from "@/lib/youcam/client";
import { getApparelProductById } from "@/lib/products";

export async function POST(request: Request) {
  const body = await request.json();
  const { fileId, productId } = body;

  if (typeof fileId !== "string" || typeof productId !== "string") {
    return NextResponse.json({ error: "Missing fileId or productId" }, { status: 400 });
  }

  const product = await getApparelProductById(productId);
  if (!product) {
    return NextResponse.json({ error: "Unknown apparel product" }, { status: 404 });
  }

  try {
    const taskId = await createClothTryOnTask({
      srcFileId: fileId,
      refImageUrl: product.refImageUrl,
      garmentCategory: product.garmentCategory,
    });
    return NextResponse.json({ taskId });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not start try-on";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
