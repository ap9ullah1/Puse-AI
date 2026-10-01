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
  kind: "skincare" | "apparel";
  qty: number;
  /** Optional try-on result URL when added after VTO */
  tryOnUrl?: string;
};

type BagContextValue = {
  items: BagItem[];
  count: number;
  subtotal: number;
  ready: boolean;
  addItem: (item: Omit<BagItem, "qty"> & { qty?: number }) => void;
  removeItem: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
};

const STORAGE_KEY = "puse_bag_v1";
const BagContext = createContext<BagContextValue | null>(null);

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
    setItems(loadBag());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const addItem = useCallback((item: Omit<BagItem, "qty"> & { qty?: number }) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.productId === item.productId);
      if (existing) {
        return prev.map((p) =>
          p.productId === item.productId
            ? {
                ...p,
                qty: p.qty + (item.qty ?? 1),
                tryOnUrl: item.tryOnUrl ?? p.tryOnUrl,
              }
            : p
        );
      }
      return [...prev, { ...item, qty: item.qty ?? 1 }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((p) => p.productId !== productId));
  }, []);

  const setQty = useCallback((productId: string, qty: number) => {
    setItems((prev) =>
      prev
        .map((p) => (p.productId === productId ? { ...p, qty } : p))
        .filter((p) => p.qty > 0)
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<BagContextValue>(() => {
    const count = items.reduce((n, i) => n + i.qty, 0);
    const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);
    return { items, count, subtotal, ready, addItem, removeItem, setQty, clear };
  }, [items, ready, addItem, removeItem, setQty, clear]);

  return <BagContext.Provider value={value}>{children}</BagContext.Provider>;
}

export function useBag(): BagContextValue {
  const ctx = useContext(BagContext);
  if (!ctx) throw new Error("useBag must be used within BagProvider");
  return ctx;
}
