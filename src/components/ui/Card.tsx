import type { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-[var(--radius)] border border-border bg-card text-card-foreground shadow-[var(--shadow-soft)] ${className}`}
      {...props}
    />
  );
}
