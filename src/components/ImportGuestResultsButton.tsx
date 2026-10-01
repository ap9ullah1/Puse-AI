"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ImportGuestResultsButton({ count }: { count: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onImport() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/claim-guest", { method: "POST" });
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.error ?? "Could not import");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not import");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-stretch gap-1 sm:items-end">
      <button
        type="button"
        disabled={loading}
        onClick={() => void onImport()}
        className="nova-ring-btn rounded-full px-4 py-2 text-sm font-medium disabled:opacity-60"
      >
        {loading ? "Importing…" : `Import ${count} guest result${count === 1 ? "" : "s"}`}
      </button>
      {error && <p className="text-xs text-amber-400">{error}</p>}
    </div>
  );
}
