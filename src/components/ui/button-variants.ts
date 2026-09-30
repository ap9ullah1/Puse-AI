export type ButtonVariant = "primary" | "outline" | "ghost";
export type ButtonSize = "md" | "lg";

export function buttonVariants(variant: ButtonVariant = "primary", size: ButtonSize = "md"): string {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition disabled:opacity-50 disabled:pointer-events-none";
  const sizes: Record<ButtonSize, string> = {
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base",
  };
  const variants: Record<ButtonVariant, string> = {
    primary: "pulse-gradient-bg text-white shadow-[var(--shadow-soft)] hover:brightness-105 active:brightness-95",
    outline: "border border-border bg-card text-foreground hover:border-accent-solid/50 hover:bg-muted",
    ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
  };
  return `${base} ${sizes[size]} ${variants[variant]}`;
}
