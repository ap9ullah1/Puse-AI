export const APPAREL_SIZES = ["XS", "S", "M", "L", "XL"] as const;
export const SHOE_SIZES = ["36", "37", "38", "39", "40", "41", "42", "43"] as const;

export type ShippingMethodId = "standard" | "express";

export const SHIPPING_METHODS: Record<
  ShippingMethodId,
  { id: ShippingMethodId; label: string; detail: string; price: number; freeOver: number | null }
> = {
  standard: {
    id: "standard",
    label: "Standard",
    detail: "5–7 business days",
    price: 8,
    freeOver: 100,
  },
  express: {
    id: "express",
    label: "Express",
    detail: "2–3 business days",
    price: 18,
    freeOver: null,
  },
};

export function requiredSizes(kind: string, category: string): readonly string[] | null {
  if (kind === "apparel") return APPAREL_SIZES;
  if (category === "footwear") return SHOE_SIZES;
  return null;
}

export function defaultSize(kind: string, category: string): string | undefined {
  const sizes = requiredSizes(kind, category);
  if (!sizes) return undefined;
  if (sizes.includes("M")) return "M";
  return sizes[Math.floor(sizes.length / 2)];
}

export function isShippingMethod(value: string): value is ShippingMethodId {
  return value === "standard" || value === "express";
}

export function orderStatusLabel(status: string): string {
  if (status === "confirmed" || status === "demo_confirmed") return "Confirmed";
  if (status === "shipped") return "Shipped";
  if (status === "cancelled") return "Cancelled";
  return status.replace(/_/g, " ");
}

export function luhnOk(raw: string): boolean {
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = Number(digits[i]);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

export function cardBrand(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (/^4/.test(digits)) return "Visa";
  if (/^5[1-5]/.test(digits) || /^2(2[2-9]|[3-6]\d|7[01]\d|720)/.test(digits)) return "Mastercard";
  if (/^3[47]/.test(digits)) return "Amex";
  if (/^6(?:011|5)/.test(digits)) return "Discover";
  return "Card";
}

export function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 19);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

export function expiryOk(raw: string, now = new Date()): boolean {
  const match = raw.trim().match(/^(\d{2})\s*\/\s*(\d{2})$/);
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return false;
  const end = new Date(year, month, 1);
  return end > now;
}
