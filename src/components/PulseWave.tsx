export function PulseWave({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 120"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="pulse-line" x1="0" y1="0" x2="600" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ff6b6b" />
          <stop offset="50%" stopColor="#f5487f" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <path
        d="M0 60 H180 L210 20 L240 100 L265 60 H320 L350 10 L380 110 L405 60 H600"
        stroke="url(#pulse-line)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
