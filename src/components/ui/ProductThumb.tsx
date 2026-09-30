import { Shirt, Sparkles } from "lucide-react";

const GRADIENTS: [string, string][] = [
  ["#ff6b6b", "#f5487f"],
  ["#f5487f", "#8b5cf6"],
  ["#8b5cf6", "#5b8def"],
  ["#ffb86b", "#ff6b6b"],
  ["#f5487f", "#ffb86b"],
];

function pickGradient(id: string): [string, string] {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) % GRADIENTS.length;
  return GRADIENTS[hash];
}

export function ProductThumb({
  id,
  kind,
  className = "",
}: {
  id: string;
  kind: "skincare" | "apparel";
  className?: string;
}) {
  const [from, to] = pickGradient(id);
  const Icon = kind === "apparel" ? Shirt : Sparkles;

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      <Icon className="h-8 w-8 text-white/90" strokeWidth={1.5} />
    </div>
  );
}
