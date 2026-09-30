"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";

export function SaveResultsBanner({ kind }: { kind: "skin" | "try-on" }) {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/auth/me")
      .then((r) => r.json())
      .then((body) => {
        if (!cancelled) setSignedIn(Boolean(body?.user));
      })
      .catch(() => {
        if (!cancelled) setSignedIn(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (signedIn !== false) return null;

  return (
    <Card className="flex flex-col gap-3 border-accent-solid/25 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium">
          {kind === "skin" ? "Keep this Skin AI result" : "Keep this try-on look"}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Create a free account to save every case and reopen them anytime from History.
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
        <Link
          href="/account?mode=register&next=/history"
          className="nova-ring-btn rounded-full px-4 py-2 text-sm font-medium"
        >
          Save to account
        </Link>
        <Link
          href="/history"
          className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground hover:text-accent-solid"
        >
          View history
        </Link>
      </div>
    </Card>
  );
}
