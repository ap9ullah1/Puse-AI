import { RotateCcw, ShieldCheck, Sparkles, Truck } from "lucide-react";

const ITEMS = [
  { icon: Truck, label: "Free shipping over $100" },
  { icon: RotateCcw, label: "30-day returns" },
  { icon: Sparkles, label: "Try on before you buy" },
  { icon: ShieldCheck, label: "Secure checkout" },
];

export function TrustRow({ compact = false }: { compact?: boolean }) {
  return (
    <ul className={`grid gap-3 ${compact ? "grid-cols-2" : "sm:grid-cols-2"}`}>
      {ITEMS.map((item) => (
        <li key={item.label} className="flex items-center gap-2 text-xs text-muted-foreground">
          <item.icon className="h-4 w-4 shrink-0 text-accent-solid" strokeWidth={1.75} />
          {item.label}
        </li>
      ))}
    </ul>
  );
}
