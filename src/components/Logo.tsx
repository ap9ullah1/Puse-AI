export function Logo({ size = 32 }: { size?: number }) {
  return (
    <span
      className="pulse-gradient-bg inline-flex shrink-0 items-center justify-center rounded-full text-[var(--accent-solid-foreground)]"
      style={{ width: size, height: size, fontSize: size * 0.55 }}
    >
      <span className="font-display font-semibold" style={{ lineHeight: 1 }}>
        P
      </span>
    </span>
  );
}
