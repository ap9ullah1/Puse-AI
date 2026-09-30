function scoreColor(score: number): string {
  if (score < 60) return "#f59e0b";
  if (score < 80) return "#62b5d1";
  return "#1de4d0";
}

export function ScoreRing({ score, label, size = 88 }: { score: number; label: string; size?: number }) {
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(100, Math.max(0, score)) / 100);
  const color = scoreColor(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="var(--border)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-display text-lg font-semibold">
          {score}
        </div>
      </div>
      <span className="text-xs font-medium capitalize tracking-wide text-muted-foreground">{label}</span>
    </div>
  );
}
