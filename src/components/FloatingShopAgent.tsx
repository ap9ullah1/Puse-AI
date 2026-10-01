"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MessageCircle, X, Send } from "lucide-react";
import { useBag } from "@/lib/bag";
import { buttonVariants } from "@/components/ui/button-variants";

type AgentProduct = {
  id: string;
  name: string;
  price: number;
  image: string;
  kind: "skincare" | "apparel";
  concern?: string | null;
};

type AgentAction = { label: string; href: string };

type ChatMessage = {
  id: string;
  role: "user" | "agent";
  text: string;
  products?: AgentProduct[];
  actions?: AgentAction[];
};

const STARTERS = ["Match my skin", "Try on a dress", "Something for pores", "Show apparel"];

export function FloatingShopAgent() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "agent",
      text: "Shop with Puse — I chain YouCam Skin AI scores to products and guide Clothes VTO try-ons. Ask me anything.",
      actions: [
        { label: "Skin AI", href: "/analyze" },
        { label: "Catalog", href: "/catalog" },
      ],
    },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { addItem } = useBag();

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setInput("");
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text: trimmed,
    };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);
    try {
      const res = await fetch("/api/shop-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Agent failed");
      setMessages((m) => [
        ...m,
        {
          id: `a-${Date.now()}`,
          role: "agent",
          text: body.reply,
          products: body.products ?? [],
          actions: body.actions ?? [],
        },
      ]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          id: `e-${Date.now()}`,
          role: "agent",
          text: err instanceof Error ? err.message : "Something went wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-[90] flex flex-col items-end gap-3">
      {open && (
        <div className="flex h-[min(32rem,70vh)] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-[var(--radius)] border border-border bg-card/95 shadow-[var(--shadow-soft)] backdrop-blur-md">
          <header className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <p className="font-display text-sm font-semibold tracking-tight">Puse shop agent</p>
              <p className="text-[11px] text-muted-foreground">Skin AI · VTO · bag</p>
            </div>
            <button
              type="button"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-accent-solid"
            >
              <X size={18} />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col gap-2 ${msg.role === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-accent-solid/15 text-foreground"
                      : "border border-border bg-muted/50 text-foreground"
                  }`}
                >
                  {msg.text}
                </div>
                {msg.products && msg.products.length > 0 && (
                  <div className="grid w-full gap-2">
                    {msg.products.map((p) => (
                      <div
                        key={p.id}
                        className="flex gap-3 rounded-xl border border-border bg-background/60 p-2"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-16 w-14 rounded-lg object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{p.name}</p>
                          <p className="text-xs text-accent-solid">${p.price}</p>
                          <div className="mt-1.5 flex flex-wrap gap-1.5">
                            <button
                              type="button"
                              className="rounded-full border border-border px-2 py-0.5 text-[11px] hover:border-accent-solid/50 hover:text-accent-solid"
                              onClick={() =>
                                addItem({
                                  productId: p.id,
                                  name: p.name,
                                  price: p.price,
                                  image: p.image,
                                  kind: p.kind,
                                })
                              }
                            >
                              Add to bag
                            </button>
                            <Link
                              href={p.kind === "apparel" ? `/try-on/${p.id}` : `/shop/${p.id}`}
                              className="rounded-full border border-border px-2 py-0.5 text-[11px] hover:border-accent-solid/50 hover:text-accent-solid"
                              onClick={() => setOpen(false)}
                            >
                              {p.kind === "apparel" ? "Try on" : "View"}
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {msg.actions.map((a) => (
                      <Link
                        key={a.href + a.label}
                        href={a.href}
                        onClick={() => setOpen(false)}
                        className="rounded-full border border-accent-solid/30 bg-accent-solid/5 px-2.5 py-1 text-[11px] text-accent-solid hover:bg-accent-solid/15"
                      >
                        {a.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <p className="text-xs text-muted-foreground">Thinking…</p>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-border px-3 py-2">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => void send(s)}
                  className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground hover:text-accent-solid"
                >
                  {s}
                </button>
              ))}
            </div>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                void send(input);
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask the shop agent…"
                className="min-w-0 flex-1 rounded-full border border-border bg-muted/40 px-3 py-2 text-sm outline-none focus:border-accent-solid"
              />
              <button
                type="submit"
                disabled={loading}
                className={`${buttonVariants("primary", "md")} !px-3`}
                aria-label="Send"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="nova-ring-btn flex h-14 w-14 items-center justify-center rounded-full shadow-[var(--shadow-soft)]"
        aria-label={open ? "Close shop agent" : "Open shop agent"}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
}
