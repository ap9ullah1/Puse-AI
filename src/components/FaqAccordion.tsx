"use client";

import { useState } from "react";
import {
  ChevronDown,
  Cpu,
  ImageIcon,
  ShieldCheck,
  ShoppingBag,
  Tag,
  UserRound,
  type LucideIcon,
} from "lucide-react";

const ICONS = {
  photo: ImageIcon,
  privacy: ShieldCheck,
  api: Cpu,
  checkout: ShoppingBag,
  account: UserRound,
  codes: Tag,
} satisfies Record<string, LucideIcon>;

export type FaqItem = {
  q: string;
  a: string;
  icon: keyof typeof ICONS;
};

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="overflow-hidden rounded-[1.25rem] border border-border bg-card shadow-[var(--shadow-soft)]">
      {items.map((item, i) => {
        const isOpen = open === i;
        const Icon = ICONS[item.icon] ?? ImageIcon;
        return (
          <div key={item.q} className={i > 0 ? "border-t border-border" : undefined}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-start gap-4 px-5 py-5 text-left transition hover:bg-muted/50 sm:px-6"
            >
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-solid/10 text-accent-solid">
                <Icon className="h-4 w-4" strokeWidth={2} />
              </span>
              <span className="min-w-0 flex-1 pt-1.5 font-display text-base font-semibold tracking-tight sm:text-lg">
                {item.q}
              </span>
              <ChevronDown
                className={`mt-2 h-5 w-5 shrink-0 text-accent-solid transition duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
                strokeWidth={2}
              />
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 pl-[4.25rem] text-sm leading-relaxed text-muted-foreground sm:px-6 sm:pl-[4.5rem]">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
