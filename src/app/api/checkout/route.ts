import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUserId } from "@/lib/auth";
import { getOrCreateSessionId } from "@/lib/session";
import { calcTotals, validateCoupon } from "@/lib/coupons";
import { isShippingMethod, requiredSizes, type ShippingMethodId } from "@/lib/commerce";

type IncomingItem = {
  productId: string;
  qty: number;
  size?: string;
  tryOnUrl?: string;
};

function cleanTryOnUrl(raw: unknown): string | undefined {
  if (typeof raw !== "string") return undefined;
  const url = raw.trim();
  if (!url || url.length > 2048) return undefined;
  if (!/^https?:\/\//i.test(url)) return undefined;
  return url;
}

function checkoutError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return checkoutError("Invalid JSON");
  }

  const obj = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
  const items = obj.items;
  const email = typeof obj.email === "string" ? obj.email.trim() : "";
  const couponCode = typeof obj.couponCode === "string" ? obj.couponCode : null;
  const shippingRaw =
    typeof obj.shipping === "object" && obj.shipping !== null
      ? (obj.shipping as Record<string, unknown>)
      : null;
  const paymentRaw =
    typeof obj.payment === "object" && obj.payment !== null
      ? (obj.payment as Record<string, unknown>)
      : null;
  const method: ShippingMethodId =
    typeof obj.shippingMethod === "string" && isShippingMethod(obj.shippingMethod)
      ? obj.shippingMethod
      : "standard";

  if (!Array.isArray(items) || items.length === 0) {
    return checkoutError("Bag is empty");
  }

  const incoming: IncomingItem[] = [];
  for (const raw of items) {
    if (typeof raw !== "object" || raw === null) continue;
    const row = raw as Record<string, unknown>;
    if (typeof row.productId !== "string" || typeof row.qty !== "number") continue;
    const qty = Math.round(row.qty);
    if (qty < 1 || qty > 9) continue;
    incoming.push({
      productId: row.productId,
      qty,
      size: typeof row.size === "string" ? row.size : undefined,
      tryOnUrl: cleanTryOnUrl(row.tryOnUrl),
    });
  }

  if (incoming.length === 0) return checkoutError("No valid items");
  if (!email.includes("@") || email.length > 120) return checkoutError("A valid email is required");
  if (!shippingRaw) return checkoutError("Shipping details required");

  const fullName = typeof shippingRaw.fullName === "string" ? shippingRaw.fullName.trim() : "";
  const address = typeof shippingRaw.address === "string" ? shippingRaw.address.trim() : "";
  const city = typeof shippingRaw.city === "string" ? shippingRaw.city.trim() : "";
  const country = typeof shippingRaw.country === "string" ? shippingRaw.country.trim() : "";
  const postal = typeof shippingRaw.postal === "string" ? shippingRaw.postal.trim() : "";
  const phone = typeof shippingRaw.phone === "string" ? shippingRaw.phone.trim() : "";

  if (!fullName || !address || !city || !country || !postal) {
    return checkoutError("Complete every shipping field");
  }
  if (phone.replace(/\D/g, "").length < 6) return checkoutError("A valid phone number is required");

  const last4 = typeof paymentRaw?.last4 === "string" ? paymentRaw.last4 : "";
  const brand = typeof paymentRaw?.brand === "string" ? paymentRaw.brand.slice(0, 20) : "";
  if (!/^\d{4}$/.test(last4) || !brand) return checkoutError("Payment details required");

  const coupon = couponCode ? validateCoupon(couponCode) : null;
  const sessionId = await getOrCreateSessionId();
  const userId = await getCurrentUserId();

  try {
    const order = await prisma.$transaction(async (tx) => {
      const lines: {
        productId: string;
        name: string;
        price: number;
        qty: number;
        kind: string;
        size?: string;
        image: string;
        tryOnUrl?: string;
      }[] = [];

      for (const item of incoming) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product) throw new Error(`Unknown product`);
        const sizes = requiredSizes(product.kind, product.category);
        if (sizes && (!item.size || !sizes.includes(item.size))) {
          throw new Error(`Choose a size for ${product.name}`);
        }
        if (product.stock < item.qty) {
          throw new Error(`${product.name} only has ${product.stock} left`);
        }
        lines.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          qty: item.qty,
          kind: product.kind,
          size: sizes ? item.size : undefined,
          image: product.image,
          ...(item.tryOnUrl ? { tryOnUrl: item.tryOnUrl } : {}),
        });
      }

      for (const line of lines) {
        const updated = await tx.product.updateMany({
          where: { id: line.productId, stock: { gte: line.qty } },
          data: { stock: { decrement: line.qty } },
        });
        if (updated.count !== 1) throw new Error(`${line.name} just sold out`);
      }

      const subtotal = lines.reduce((n, line) => n + line.price * line.qty, 0);
      const totals = calcTotals(subtotal, coupon, method);

      return tx.order.create({
        data: {
          sessionId,
          userId: userId ?? undefined,
          email,
          items: JSON.stringify(lines),
          subtotal: totals.subtotal,
          discount: totals.discount,
          shippingCost: totals.shippingCost,
          total: totals.total,
          couponCode: coupon?.code,
          shipping: JSON.stringify({
            fullName,
            address,
            city,
            country,
            postal,
            phone,
            method,
            payment: { brand, last4 },
          }),
          status: "confirmed",
        },
      });
    });

    return NextResponse.json({ ok: true, orderId: order.id, total: order.total });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not place the order";
    const known =
      message === "Unknown product" ||
      message.startsWith("Choose a size") ||
      message.includes("only has") ||
      message.includes("sold out");
    return checkoutError(known ? message : "Could not place the order", known ? 409 : 400);
  }
}
