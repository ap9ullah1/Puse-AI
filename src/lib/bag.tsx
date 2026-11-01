"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type BagItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  kind: "skincare" | "apparel" | "accessory";
  category?: string;
  qty: number;
  size?: string;
  /** Apparel that has a Clothes VTO garment reference */
  vto?: boolean;
  /** Optional try-on result URL when added after VTO */
  tryOnUrl?: string;
};

type BagContextValue = {
  items: BagItem[];
  count: number;
  subtotal: number;
  ready: boolean;
  addItem: (item: Omit<BagItem, "qty"> & { qty?: number }) => void;
  removeItem: (productId: string, size?: string) => void;
  setQty: (productId: string, qty: number, size?: string) => void;
  setSize: (productId: string, fromSize: string | undefined, toSize: string) => void;
  clear: () => void;
};

const STORAGE_KEY = "puse_bag_v1";
const BagContext = createContext<BagContextValue | null>(null);

function sameLine(item: BagItem, productId: string, size?: string) {
  return item.productId === productId && (item.size ?? "") === (size ?? "");
}

function loadBag(): BagItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as BagItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function BagProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BagItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage, unavailable during SSR
    setItems(loadBag());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const addItem = useCallback((item: Omit<BagItem, "qty"> & { qty?: number }) => {
    const qty = Math.max(1, Math.min(9, item.qty ?? 1));
    setItems((prev) => {
      const existing = prev.find((p) => sameLine(p, item.productId, item.size));
      if (existing) {
        return prev.map((p) =>
          sameLine(p, item.productId, item.size)
            ? {
                ...p,
                qty: Math.min(9, p.qty + qty),
                tryOnUrl: item.tryOnUrl ?? p.tryOnUrl,
                vto: item.vto ?? p.vto,
                category: item.category ?? p.category,
              }
            : p
        );
      }
      return [...prev, { ...item, qty }];
    });
  }, []);

  const removeItem = useCallback((productId: string, size?: string) => {
    setItems((prev) => prev.filter((p) => !sameLine(p, productId, size)));
  }, []);

  const setQty = useCallback((productId: string, qty: number, size?: string) => {
    const next = Math.max(0, Math.min(9, Math.round(qty)));
    setItems((prev) =>
      prev
        .map((p) => (sameLine(p, productId, size) ? { ...p, qty: next } : p))
        .filter((p) => p.qty > 0)
    );
  }, []);

  const setSize = useCallback((productId: string, fromSize: string | undefined, toSize: string) => {
    setItems((prev) => {
      const current = prev.find((p) => sameLine(p, productId, fromSize));
      if (!current || current.size === toSize) return prev;
      const target = prev.find((p) => sameLine(p, productId, toSize));
      if (target) {
        return prev
          .filter((p) => !sameLine(p, productId, fromSize))
          .map((p) =>
            sameLine(p, productId, toSize)
              ? {
                  ...p,
                  qty: Math.min(9, p.qty + current.qty),
                  tryOnUrl: current.tryOnUrl ?? p.tryOnUrl,
                }
              : p
          );
      }
      return prev.map((p) => (sameLine(p, productId, fromSize) ? { ...p, size: toSize } : p));
    });
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<BagContextValue>(() => {
    const count = items.reduce((n, i) => n + i.qty, 0);
    const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);
    return { items, count, subtotal, ready, addItem, removeItem, setQty, setSize, clear };
  }, [items, ready, addItem, removeItem, setQty, setSize, clear]);

  return <BagContext.Provider value={value}>{children}</BagContext.Provider>;
}

export function useBag(): BagContextValue {
  const ctx = useContext(BagContext);
  if (!ctx) throw new Error("useBag must be used within BagProvider");
  return ctx;
}
