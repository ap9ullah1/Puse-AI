import { Shirt, Sparkles } from "lucide-react";

const GRADIENTS: [string, string][] = [
  ["#6d28d9", "#ec4899"],
  ["#7c3aed", "#f472b6"],
  ["#a855f7", "#fb7185"],
  ["#4c1d95", "#e879f9"],
  ["#c026d3", "#f9a8d4"],
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
  kind: "skincare" | "apparel" | "accessory";
  className?: string;
}) {
  const [from, to] = pickGradient(id);
  const Icon = kind === "skincare" ? Sparkles : Shirt;

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      <Icon className="h-8 w-8 text-white" strokeWidth={1.5} />
    </div>
  );
}
