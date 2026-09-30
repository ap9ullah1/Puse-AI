import Link from "next/link";
import { prisma } from "@/lib/db";
import { readSessionId } from "@/lib/session";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
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
    <main className="mx-auto flex max-w-3xl flex-col gap-14 px-6 py-16">
      <div>
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back
        </Link>
        <h1 className="mt-3 font-display text-4xl italic">Your history</h1>
        <p className="mt-3 text-muted-foreground">
          Skin analyses and try-ons saved to this browser session.
        </p>
      </div>

      <section>
        <h2 className="mb-4 font-display text-2xl italic">Skin analyses</h2>
        {skinResults.length === 0 && <p className="text-sm text-muted-foreground">None yet.</p>}
        <ul className="flex flex-col gap-3">
          {skinResults.map((result) => {
            const concerns = JSON.parse(result.concerns) as SkinConcernResult[];
            const top = [...concerns].sort((a, b) => a.ui_score - b.ui_score).slice(0, 3);
            return (
              <Card key={result.id} className="flex flex-col gap-2 p-4">
                <p className="text-xs text-muted-foreground">{result.createdAt.toLocaleString()}</p>
                <div className="flex flex-wrap gap-2">
                  {top.map((c) => (
                    <Badge key={c.type}>{c.type.replace(/_/g, " ")}</Badge>
                  ))}
                </div>
              </Card>
            );
          })}
        </ul>
      </section>

      <section>
        <h2 className="mb-4 font-display text-2xl italic">Try-ons</h2>
        {tryOnResults.length === 0 && <p className="text-sm text-muted-foreground">None yet.</p>}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {tryOnResults.map((result) => (
            <Card key={result.id} className="overflow-hidden p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.resultUrl}
                alt={result.product.name}
                className="mb-2 h-40 w-full rounded-[calc(var(--radius)-0.4rem)] object-cover"
              />
              <p className="text-sm font-medium">{result.product.name}</p>
              <p className="text-xs text-muted-foreground">{result.createdAt.toLocaleString()}</p>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
