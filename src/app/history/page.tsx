import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { readSessionId } from "@/lib/session";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/Reveal";
import { LightboxImage } from "@/components/ui/LightboxImage";
import type { SkinConcernResult } from "@/lib/youcam/types";

export const dynamic = "force-dynamic";

type CaseFilter = "all" | "skin" | "try-on";

function parseFilter(raw: string | undefined): CaseFilter {
  if (raw === "skin" || raw === "try-on") return raw;
  return "all";
}

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ case?: string }>;
}) {
  const params = await searchParams;
  const filter = parseFilter(params.case);
  const user = await getCurrentUser();
  const sessionId = await readSessionId();

  const skinWhere = user
    ? { userId: user.id }
    : sessionId
      ? { sessionId, userId: null }
      : null;
  const tryOnWhere = user
    ? { userId: user.id }
    : sessionId
      ? { sessionId, userId: null }
      : null;

  const [skinResults, tryOnResults] = await Promise.all([
    skinWhere
      ? prisma.skinAnalysisResult.findMany({
          where: skinWhere,
          orderBy: { createdAt: "desc" },
        })
      : Promise.resolve([]),
    tryOnWhere
      ? prisma.tryOnResult.findMany({
          where: tryOnWhere,
          orderBy: { createdAt: "desc" },
          include: { product: true },
        })
      : Promise.resolve([]),
  ]);

  const showSkin = filter === "all" || filter === "skin";
  const showTryOn = filter === "all" || filter === "try-on";
  const total = skinResults.length + tryOnResults.length;

  const filters: { id: CaseFilter; label: string; count: number }[] = [
    { id: "all", label: "All cases", count: total },
    { id: "skin", label: "Skin AI", count: skinResults.length },
    { id: "try-on", label: "Try-ons", count: tryOnResults.length },
  ];

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-16 sm:px-10">
      <Reveal>
        <Link href="/" className="text-sm text-muted-foreground hover:text-accent-solid">
          ← Back
        </Link>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          {user ? "Your saved results" : "Your history"}
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          {user
            ? `Signed in as ${user.email}. Every Skin AI analysis and virtual try-on you generate is kept here.`
            : "Guest mode — results stay on this browser. Create an account to keep them across devices."}
        </p>
        {!user && (
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/account?mode=register&next=/history"
              className="nova-ring-btn rounded-full px-5 py-2.5 text-sm font-medium"
            >
              Create account to save
            </Link>
            <Link
              href="/account?mode=login&next=/history"
              className="rounded-full border border-border px-5 py-2.5 text-sm text-muted-foreground hover:border-accent-solid/40 hover:text-accent-solid"
            >
              Sign in
            </Link>
          </div>
        )}
      </Reveal>

      <Reveal>
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => {
            const active = filter === f.id;
            const href = f.id === "all" ? "/history" : `/history?case=${f.id}`;
            return (
              <Link
                key={f.id}
                href={href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-card text-accent-solid ring-1 ring-accent-solid/50"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {f.label}
                <span className="ml-1.5 text-xs opacity-70">({f.count})</span>
              </Link>
            );
          })}
        </div>
      </Reveal>

      {total === 0 && (
        <Card className="p-6 text-sm text-muted-foreground">
          Nothing saved yet. Run a{" "}
          <Link href="/analyze" className="text-accent-solid hover:underline">
            Skin AI analysis
          </Link>{" "}
          or{" "}
          <Link href="/catalog" className="text-accent-solid hover:underline">
            try on apparel
          </Link>
          {user ? " — results will appear here automatically." : "."}
        </Card>
      )}

      {showSkin && (
        <section>
          <Reveal>
            <h2 className="mb-6 font-display text-2xl font-semibold tracking-tight">
              Skin analyses
            </h2>
          </Reveal>
          {skinResults.length === 0 && (
            <p className="text-sm text-muted-foreground">No Skin AI cases yet.</p>
          )}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {skinResults.map((result, i) => {
              const concerns = JSON.parse(result.concerns) as SkinConcernResult[];
              const top = [...concerns].sort((a, b) => a.ui_score - b.ui_score).slice(0, 3);
              return (
                <Reveal key={result.id} delay={i * 60}>
                  <Card className="flex h-full flex-col gap-2 p-5">
                    <div className="flex items-center justify-between gap-2">
                      <Badge>Skin AI</Badge>
                      <p className="text-xs text-muted-foreground">
                        {result.createdAt.toLocaleString()}
                      </p>
                    </div>
                    <p className="text-sm font-medium">Top concerns</p>
                    <div className="flex flex-wrap gap-2">
                      {top.map((c) => (
                        <Badge key={c.type}>
                          {c.type.replace(/_/g, " ")} · {Math.round(c.ui_score)}
                        </Badge>
                      ))}
                    </div>
                    {concerns.length > 3 && (
                      <p className="mt-auto pt-2 text-xs text-muted-foreground">
                        +{concerns.length - 3} more scores saved
                      </p>
                    )}
                  </Card>
                </Reveal>
              );
            })}
          </div>
        </section>
      )}

      {showTryOn && (
        <section>
          <Reveal>
            <h2 className="mb-6 font-display text-2xl font-semibold tracking-tight">Try-ons</h2>
          </Reveal>
          {tryOnResults.length === 0 && (
            <p className="text-sm text-muted-foreground">No try-on cases yet.</p>
          )}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {tryOnResults.map((result, i) => (
              <Reveal key={result.id} delay={i * 60}>
                <Card className="overflow-hidden p-3">
                  <LightboxImage
                    src={result.resultUrl}
                    alt={result.product.name}
                    className="mb-2 h-56 w-full rounded-[calc(var(--radius)-0.4rem)]"
                  />
                  <div className="mb-1">
                    <Badge>Try-on</Badge>
                  </div>
                  <p className="text-sm font-medium">{result.product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {result.createdAt.toLocaleString()}
                  </p>
                </Card>
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
