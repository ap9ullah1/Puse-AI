import { SHIPPING_METHODS, type ShippingMethodId } from "./commerce";

export type CouponResult = {
  code: string;
  discountPercent: number;
  label: string;
};

const COUPONS: Record<string, CouponResult> = {
  PUSE10: { code: "PUSE10", discountPercent: 10, label: "10% off your order" },
  SKINAI: { code: "SKINAI", discountPercent: 15, label: "15% Skin AI shopper perk" },
  TRYON: { code: "TRYON", discountPercent: 12, label: "12% after virtual try-on" },
};

export function validateCoupon(raw: string): CouponResult | null {
  const code = raw.trim().toUpperCase();
  return COUPONS[code] ?? null;
}

export function calcTotals(
  subtotal: number,
  coupon: CouponResult | null,
  method: ShippingMethodId = "standard"
) {
  const discount = coupon ? Math.round((subtotal * coupon.discountPercent) / 100) : 0;
  const afterDiscount = Math.max(0, subtotal - discount);
  const spec = SHIPPING_METHODS[method];
  const shippingCost =
    afterDiscount === 0
      ? 0
      : spec.freeOver != null && afterDiscount >= spec.freeOver
        ? 0
        : spec.price;
  const total = afterDiscount + shippingCost;
  return { subtotal, discount, shippingCost, total, shippingMethod: spec.id };
}
