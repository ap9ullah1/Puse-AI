"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

type LightboxProps = {
  src: string;
  alt: string;
  open: boolean;
  onClose: () => void;
};

function Lightbox({ src, alt, open, onClose }: LightboxProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full border border-border bg-card/90 px-3 py-1.5 text-sm text-foreground hover:border-accent-solid/50 hover:text-accent-solid"
      >
        Close
      </button>
      <div
        className="relative max-h-[90vh] max-w-[min(92vw,920px)]"
        onClick={(e) => e.stopPropagation()}
      >
        <p id={titleId} className="sr-only">
          {alt}
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="max-h-[90vh] w-auto max-w-full rounded-[var(--radius)] object-contain shadow-[var(--shadow-soft)] ring-1 ring-accent-solid/20"
        />
        {alt ? (
          <p className="mt-3 text-center text-sm text-muted-foreground">{alt}</p>
        ) : null}
      </div>
    </div>,
    document.body
  );
}

/** Clickable thumbnail that opens a full-size modal. */
export function LightboxImage({
  src,
  alt,
  className = "",
  children,
}: {
  src: string;
  alt: string;
  className?: string;
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        className={`group relative block cursor-zoom-in overflow-hidden p-0 text-left ${className.includes("w-full") ? "w-full" : ""}`}
        aria-label={`Open ${alt}`}
      >
        {children ?? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} className={`object-cover transition group-hover:opacity-90 ${className}`} />
        )}
        <span className="pointer-events-none absolute bottom-2 right-2 rounded-full border border-border/80 bg-background/80 px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
          View
        </span>
      </button>
      <Lightbox src={src} alt={alt} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
