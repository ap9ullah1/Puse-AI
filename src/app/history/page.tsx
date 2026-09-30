import Link from "next/link";
import { prisma } from "@/lib/db";
import { readSessionId } from "@/lib/session";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/Reveal";
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
    <main className="mx-auto flex max-w-5xl flex-col gap-16 px-6 py-16 sm:px-10">
      <Reveal>
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back
        </Link>
        <h1 className="mt-3 font-display text-4xl italic sm:text-5xl">Your history</h1>
        <p className="mt-3 text-muted-foreground">
          Skin analyses and try-ons saved to this browser session.
        </p>
      </Reveal>

      <section>
        <Reveal>
          <h2 className="mb-6 font-display text-2xl italic">Skin analyses</h2>
        </Reveal>
        {skinResults.length === 0 && <p className="text-sm text-muted-foreground">None yet.</p>}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skinResults.map((result, i) => {
            const concerns = JSON.parse(result.concerns) as SkinConcernResult[];
            const top = [...concerns].sort((a, b) => a.ui_score - b.ui_score).slice(0, 3);
            return (
              <Reveal key={result.id} delay={i * 60}>
                <Card className="flex h-full flex-col gap-2 p-5">
                  <p className="text-xs text-muted-foreground">
                    {result.createdAt.toLocaleString()}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {top.map((c) => (
                      <Badge key={c.type}>{c.type.replace(/_/g, " ")}</Badge>
                    ))}
                  </div>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section>
        <Reveal>
          <h2 className="mb-6 font-display text-2xl italic">Try-ons</h2>
        </Reveal>
        {tryOnResults.length === 0 && <p className="text-sm text-muted-foreground">None yet.</p>}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {tryOnResults.map((result, i) => (
            <Reveal key={result.id} delay={i * 60}>
              <Card className="overflow-hidden p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={result.resultUrl}
                  alt={result.product.name}
                  className="mb-2 h-56 w-full rounded-[calc(var(--radius)-0.4rem)] object-cover"
                />
                <p className="text-sm font-medium">{result.product.name}</p>
                <p className="text-xs text-muted-foreground">
                  {result.createdAt.toLocaleString()}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
