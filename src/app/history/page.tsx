import Link from "next/link";
import { prisma } from "@/lib/db";
import { readSessionId } from "@/lib/session";
import type { SkinConcernResult } from "@/lib/youcam/types";

export default async function HistoryPage() {
  const sessionId = await readSessionId();

  const [skinResults, tryOnResults] = sessionId
    ? await Promise.all([
        prisma.skinAnalysisResult.findMany({
          where: { sessionId },
          orderBy: { createdAt: "desc" },
        }),
        prisma.tryOnResult.findMany({
          where: { sessionId },
          orderBy: { createdAt: "desc" },
          include: { product: true },
        }),
      ])
    : [[], []];

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-16">
      <div>
        <Link href="/" className="text-sm text-zinc-500 hover:underline">
          ← Back
        </Link>
        <h1 className="mt-2 text-3xl font-semibold">Your history</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Skin analyses and try-ons saved to this browser session.
        </p>
      </div>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Skin analyses</h2>
        {skinResults.length === 0 && <p className="text-zinc-500">None yet.</p>}
        <ul className="flex flex-col gap-3">
          {skinResults.map((result) => {
            const concerns = JSON.parse(result.concerns) as SkinConcernResult[];
            const top = [...concerns].sort((a, b) => a.ui_score - b.ui_score).slice(0, 3);
            return (
              <li
                key={result.id}
                className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
              >
                <p className="text-sm text-zinc-500">{result.createdAt.toLocaleString()}</p>
                <p className="mt-1 text-sm">
                  Top concerns: {top.map((c) => c.type.replace(/_/g, " ")).join(", ")}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Try-ons</h2>
        {tryOnResults.length === 0 && <p className="text-zinc-500">None yet.</p>}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {tryOnResults.map((result) => (
            <div key={result.id} className="rounded-xl border border-zinc-200 p-3 dark:border-zinc-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.resultUrl}
                alt={result.product.name}
                className="mb-2 h-40 w-full rounded-lg object-cover"
              />
              <p className="text-sm font-medium">{result.product.name}</p>
              <p className="text-xs text-zinc-500">{result.createdAt.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
