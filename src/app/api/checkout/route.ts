import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUserId } from "@/lib/auth";
import { getOrCreateSessionId } from "@/lib/session";

type CheckoutItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
  kind: string;
};

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const items =
    typeof body === "object" && body !== null && "items" in body
      ? (body as { items: unknown }).items
      : null;

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Bag is empty" }, { status: 400 });
  }

  const normalized: CheckoutItem[] = [];
  for (const raw of items) {
    if (typeof raw !== "object" || raw === null) continue;
    const row = raw as Record<string, unknown>;
    if (
      typeof row.productId !== "string" ||
      typeof row.name !== "string" ||
      typeof row.price !== "number" ||
      typeof row.qty !== "number" ||
      typeof row.kind !== "string"
    ) {
      continue;
    }
    if (row.qty < 1 || row.price < 0) continue;
    normalized.push({
      productId: row.productId,
      name: row.name,
      price: Math.round(row.price),
      qty: Math.round(row.qty),
      kind: row.kind,
    });
  }

  if (normalized.length === 0) {
    return NextResponse.json({ error: "No valid items" }, { status: 400 });
  }

  const sessionId = await getOrCreateSessionId();
  const userId = await getCurrentUserId();
  const total = normalized.reduce((n, i) => n + i.price * i.qty, 0);

  const order = await prisma.order.create({
    data: {
      sessionId,
      userId: userId ?? undefined,
      items: JSON.stringify(normalized),
      total,
      status: "demo_confirmed",
    },
  });

  return NextResponse.json({
    ok: true,
    orderId: order.id,
    total: order.total,
    demo: true,
    message: "Demo order confirmed — no real payment charged.",
  });
}
