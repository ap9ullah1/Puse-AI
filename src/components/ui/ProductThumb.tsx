import { Shirt, Sparkles } from "lucide-react";

const GRADIENTS: [string, string][] = [
  ["#04524a", "#1de4d0"],
  ["#0f3a33", "#62b5d1"],
  ["#1de4d0", "#62b5d1"],
  ["#04524a", "#62b5d1"],
  ["#0d1e1e", "#1de4d0"],
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
      <Icon className="h-8 w-8 text-[#000d0d]/90" strokeWidth={1.5} />
    </div>
  );
}
