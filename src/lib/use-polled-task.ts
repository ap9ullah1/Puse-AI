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
    if (!endpoint) return;

    let cancelled = false;

    async function poll() {
      while (!cancelled) {
        const res = await fetch(endpoint as string);
        const body = await res.json();

        if (cancelled) return;

        if (!res.ok) {
          setSettled({ kind: "error", data: { task_status: "error", error: body.error } as T });
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
