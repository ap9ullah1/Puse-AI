import type { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-[var(--radius)] border border-border bg-card/90 text-card-foreground shadow-[var(--shadow-soft)] backdrop-blur-sm ${className}`}
      {...props}
    />
  );
}
