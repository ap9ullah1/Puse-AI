import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { readSessionId } from "@/lib/session";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/Reveal";
import { LightboxImage } from "@/components/ui/LightboxImage";
import { ImportGuestResultsButton } from "@/components/ImportGuestResultsButton";
import { buttonVariants } from "@/components/ui/button-variants";
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

  // Logged-in users ONLY see their userId rows — never other guests' session data.
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

  const [skinResults, tryOnResults, guestSkinCount, guestTryOnCount] = await Promise.all([
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
    user && sessionId
      ? prisma.skinAnalysisResult.count({ where: { sessionId, userId: null } })
      : Promise.resolve(0),
    user && sessionId
      ? prisma.tryOnResult.count({ where: { sessionId, userId: null } })
      : Promise.resolve(0),
  ]);

  const guestImportCount = guestSkinCount + guestTryOnCount;
  const showSkin = filter === "all" || filter === "skin";
  const showTryOn = filter === "all" || filter === "try-on";
  const visibleSkin = showSkin ? skinResults : [];
  const visibleTryOn = showTryOn ? tryOnResults : [];
  const visibleTotal = visibleSkin.length + visibleTryOn.length;

  const filters: { id: CaseFilter; label: string; count: number }[] = [
    { id: "all", label: "All cases", count: skinResults.length + tryOnResults.length },
    { id: "skin", label: "Skin AI", count: skinResults.length },
    { id: "try-on", label: "Try-ons", count: tryOnResults.length },
  ];

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-16 sm:px-10">
      <Reveal>
        <Link href="/" className="text-sm text-muted-foreground hover:text-accent-solid">
          ← Back
        </Link>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          {user ? "Your saved results" : "Your history"}
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          {user
            ? `Signed in as ${user.email}. Only results generated on this account are listed here.`
            : "Guest mode — only this browser’s unsaved results. Create an account so new scans and try-ons stay with you."}
        </p>
        {!user && (
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/account?mode=register&next=/history"
              className="nova-ring-btn rounded-full px-5 py-2.5 text-sm font-medium"
            >
              Create account
            </Link>
            <Link
              href="/account?mode=login&next=/history"
              className="rounded-full border border-border px-5 py-2.5 text-sm text-muted-foreground hover:border-accent-solid/40 hover:text-accent-solid"
            >
              Sign in
            </Link>
          </div>
        )}
        {user && guestImportCount > 0 && (
          <Card className="mt-5 flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              This browser still has <span className="text-foreground">{guestImportCount}</span>{" "}
              guest result{guestImportCount === 1 ? "" : "s"} not linked to your account.
            </p>
            <ImportGuestResultsButton count={guestImportCount} />
          </Card>
        )}
      </Reveal>

      <Card className="overflow-hidden p-0">
        <div className="flex flex-wrap gap-1 border-b border-border bg-muted/30 p-2">
          {filters.map((f) => {
            const active = filter === f.id;
            const href = f.id === "all" ? "/history" : `/history?case=${f.id}`;
            return (
              <Link
                key={f.id}
                href={href}
                className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-card text-accent-solid shadow-sm ring-1 ring-accent-solid/40"
                    : "text-muted-foreground hover:bg-card/60 hover:text-foreground"
                }`}
              >
                {f.label}
                <span className="ml-1.5 text-xs opacity-70">({f.count})</span>
              </Link>
            );
          })}
        </div>

        <div className="flex flex-col gap-10 p-5 sm:p-6">
          {visibleTotal === 0 ? (
            <div className="flex flex-col items-start gap-4 py-6">
              <p className="text-sm text-muted-foreground">
                {filter === "skin"
                  ? "No Skin AI cases on this account yet."
                  : filter === "try-on"
                    ? "No try-on cases on this account yet."
                    : "Nothing saved on this account yet."}
              </p>
              <div className="flex flex-wrap gap-3">
                {(filter === "all" || filter === "skin") && (
                  <Link href="/analyze" className={buttonVariants("primary", "md")}>
                    Run Skin AI
                  </Link>
                )}
                {(filter === "all" || filter === "try-on") && (
                  <Link href="/catalog" className={buttonVariants("outline", "md")}>
                    Shop & try on
                  </Link>
                )}
                <Link href="/bag" className={buttonVariants("ghost", "md")}>
                  Open bag
                </Link>
              </div>
            </div>
          ) : (
            <>
              {showSkin && visibleSkin.length > 0 && (
                <section>
                  <h2 className="mb-4 font-display text-xl font-semibold tracking-tight">
                    Skin analyses
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {visibleSkin.map((result) => {
                      const concerns = JSON.parse(result.concerns) as SkinConcernResult[];
                      const top = [...concerns]
                        .sort((a, b) => a.ui_score - b.ui_score)
                        .slice(0, 3);
                      return (
                        <div
                          key={result.id}
                          className="flex h-full flex-col gap-2 rounded-[calc(var(--radius)-0.25rem)] border border-border bg-background/40 p-5"
                        >
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
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {showTryOn && visibleTryOn.length > 0 && (
                <section>
                  <h2 className="mb-4 font-display text-xl font-semibold tracking-tight">
                    Try-ons
                  </h2>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {visibleTryOn.map((result) => (
                      <div
                        key={result.id}
                        className="overflow-hidden rounded-[calc(var(--radius)-0.25rem)] border border-border bg-background/40 p-3"
                      >
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
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </Card>

      <p className="text-center text-sm text-muted-foreground">
        Ecommerce lives in the same app —{" "}
        <Link href="/catalog" className="text-accent-solid hover:underline">
          Shop
        </Link>
        ,{" "}
        <Link href="/bag" className="text-accent-solid hover:underline">
          Bag
        </Link>
        , and the chat bubble shop agent.
      </p>
    </main>
  );
}
