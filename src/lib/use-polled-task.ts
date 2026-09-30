"use client";

import { useEffect, useState } from "react";

type TaskBody = {
  task_status: "running" | "success" | "error";
  error?: string | null;
  error_message?: string | null;
};

type Settled<T> = { kind: "success" | "error"; data: T };

export function usePolledTask<T extends TaskBody>(endpoint: string | null) {
  const [settled, setSettled] = useState<Settled<T> | null>(null);

  useEffect(() => {
    // Always clear prior result when the endpoint changes (or clears),
    // so a new upload never shows the previous task's success/error.
    setSettled(null);

    if (!endpoint) return;

    let cancelled = false;

    async function poll() {
      while (!cancelled) {
        try {
          const res = await fetch(endpoint as string);
          const body = await res.json().catch(() => null);

          if (cancelled) return;

          if (!res.ok || !body) {
            setSettled({
              kind: "error",
              data: {
                task_status: "error",
                error: body?.error ?? "Could not check analysis status",
              } as T,
            });
            return;
          }

          if (body.task_status === "success") {
            setSettled({ kind: "success", data: body as T });
            return;
          }

          if (body.task_status === "error") {
            setSettled({ kind: "error", data: body as T });
            return;
          }
        } catch {
          if (cancelled) return;
          setSettled({
            kind: "error",
            data: {
              task_status: "error",
              error: "Network error while checking analysis. Try again.",
            } as T,
          });
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    void poll();

    return () => {
      cancelled = true;
    };
  }, [endpoint]);

  if (!endpoint) {
    return { status: "idle" as const, data: null as T | null };
  }

  if (!settled) {
    return { status: "running" as const, data: null as T | null };
  }

  return { status: settled.kind, data: settled.data };
}
