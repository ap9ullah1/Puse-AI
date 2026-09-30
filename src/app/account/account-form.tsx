"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";

type Mode = "login" | "register";

export function AccountForm({
  initialMode = "login",
  nextPath = "/history",
}: {
  initialMode?: Mode;
  nextPath?: string;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "login" ? { email, password } : { email, password, name }
        ),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(body?.error ?? "Something went wrong");
      }
      if (typeof body?.claimed === "number" && body.claimed > 0) {
        setInfo(`Saved ${body.claimed} result${body.claimed === 1 ? "" : "s"} from this browser to your account.`);
      }
      router.push(nextPath);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-md p-6 sm:p-8">
      <div className="mb-6 flex gap-2 rounded-full border border-border bg-muted/40 p-1">
        {(["login", "register"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => {
              setMode(tab);
              setError(null);
              setInfo(null);
            }}
            className={`flex-1 rounded-full px-3 py-2 text-sm font-medium transition ${
              mode === tab
                ? "bg-card text-accent-solid shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "login" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>

      <h1 className="font-display text-2xl font-semibold tracking-tight">
        {mode === "login" ? "Welcome back" : "Keep your results"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {mode === "login"
          ? "Sign in to view every Skin AI analysis and try-on you’ve saved."
          : "Create a free account so generated looks stay with you across devices."}
      </p>

      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
        {mode === "register" && (
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-muted-foreground">Name (optional)</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl border border-border bg-muted/40 px-3 py-2.5 outline-none focus:border-accent-solid"
              autoComplete="name"
            />
          </label>
        )}
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-muted-foreground">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl border border-border bg-muted/40 px-3 py-2.5 outline-none focus:border-accent-solid"
            autoComplete="email"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-muted-foreground">Password</span>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl border border-border bg-muted/40 px-3 py-2.5 outline-none focus:border-accent-solid"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
        </label>

        {error && <p className="text-sm text-amber-400">{error}</p>}
        {info && <p className="text-sm text-accent-solid">{info}</p>}

        <button
          type="submit"
          disabled={loading}
          className="nova-ring-btn mt-1 rounded-full px-5 py-2.5 text-sm font-medium disabled:opacity-60"
        >
          {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
        </button>
      </form>

      <p className="mt-5 text-center text-xs text-muted-foreground">
        Or continue as guest — results stay on this browser until you{" "}
        <Link href="/history" className="text-accent-solid hover:underline">
          claim them
        </Link>
        .
      </p>
    </Card>
  );
}
