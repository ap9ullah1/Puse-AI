export function Logo({ size = 32 }: { size?: number }) {
  return (
    <span
      className="pulse-gradient-bg inline-flex shrink-0 items-center justify-center rounded-full text-white"
      style={{ width: size, height: size, fontSize: size * 0.55 }}
    >
      <span className="font-display italic" style={{ lineHeight: 1 }}>
        P
      </span>
    </span>
  );
}
