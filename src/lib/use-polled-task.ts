"use client";

import { useEffect, useState } from "react";

type TaskBody = {
  task_status: "running" | "success" | "error";
  error?: string | null;
};

type Settled<T> = { kind: "success"; data: T } | { kind: "error"; error: string };

export function usePolledTask<T extends TaskBody>(endpoint: string | null) {
  const [settled, setSettled] = useState<Settled<T> | null>(null);

  useEffect(() => {
    if (!endpoint) return;

    let cancelled = false;

    async function poll() {
      while (!cancelled) {
        const res = await fetch(endpoint as string);
        const body = await res.json();

        if (cancelled) return;

        if (!res.ok) {
          setSettled({ kind: "error", error: body.error ?? "Request failed" });
          return;
        }

        if (body.task_status === "success") {
          setSettled({ kind: "success", data: body });
          return;
        }

        if (body.task_status === "error") {
          setSettled({ kind: "error", error: body.error ?? "Task failed" });
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
    return { status: "idle" as const, data: null, error: null };
  }

  if (!settled) {
    return { status: "running" as const, data: null, error: null };
  }

  if (settled.kind === "success") {
    return { status: "success" as const, data: settled.data, error: null };
  }

  return { status: "error" as const, data: null, error: settled.error };
}
