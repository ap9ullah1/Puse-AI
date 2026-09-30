import Link from "next/link";
import { prisma } from "@/lib/db";
import { actionLabel, shortSession } from "@/lib/analytics";
import { locationLabel } from "@/lib/geo";
import { isOwnerAuthenticated } from "@/lib/dashboard-auth";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/Reveal";
import { OwnerLoginForm } from "./login-form";
import { OwnerLogoutButton } from "./logout-button";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Owner · Puse",
  robots: { index: false, follow: false },
};

function browserFromUa(ua: string | null): string {
  if (!ua) return "Unknown device";
  if (/iPhone|iPad/i.test(ua)) return "iOS";
  if (/Android/i.test(ua)) return "Android";
  if (/Macintosh/i.test(ua)) return "Mac";
  if (/Windows/i.test(ua)) return "Windows";
  if (/Linux/i.test(ua)) return "Linux";
  return "Web";
}

function relativeTime(date: Date): string {
  const seconds = Math.round((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export default async function OwnerDashboardPage() {
  const authed = await isOwnerAuthenticated();
  if (!authed) {
    return <OwnerLoginForm />;
  }

  const since = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7);

  const [events, totalEvents, uniqueSessions, skinStarts, tryOnStarts, countriesRaw] =
    await Promise.all([
      prisma.visitEvent.findMany({
        orderBy: { createdAt: "desc" },
        take: 80,
      }),
      prisma.visitEvent.count(),
      prisma.visitEvent.findMany({
        distinct: ["sessionId"],
        select: { sessionId: true },
      }),
      prisma.visitEvent.count({ where: { action: "skin_analysis_start" } }),
      prisma.visitEvent.count({ where: { action: "try_on_start" } }),
      prisma.visitEvent.groupBy({
        by: ["country"],
        where: { country: { not: null }, createdAt: { gte: since } },
        _count: { _all: true },
        orderBy: { _count: { country: "desc" } },
        take: 8,
      }),
    ]);

  const pageViews = events.filter((e) => e.action === "page_view").length;
  const maxCountry = Math.max(1, ...countriesRaw.map((c) => c._count._all));

  const bySession = new Map<
    string,
    {
      sessionId: string;
      location: string;
      device: string;
      lastAt: Date;
      actions: string[];
      paths: string[];
    }
  >();

  for (const event of events) {
    const existing = bySession.get(event.sessionId);
    const loc = locationLabel({
      city: event.city,
      region: event.region,
      country: event.country,
    });
    const device = browserFromUa(event.userAgent);
    const actionText = event.label || actionLabel(event.action);
    if (!existing) {
      bySession.set(event.sessionId, {
        sessionId: event.sessionId,
        location: loc,
        device,
        lastAt: event.createdAt,
        actions: [actionText],
        paths: event.path ? [event.path] : [],
      });
    } else if (existing.actions.length < 6) {
      existing.actions.push(actionText);
      if (event.path && !existing.paths.includes(event.path)) {
        existing.paths.push(event.path);
      }
    }
  }

  const visitors = [...bySession.values()].slice(0, 24);

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-14 sm:px-10">
      <Reveal>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="suite-tag">Owner dashboard</p>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              Who&apos;s here
            </h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Live visitor activity — where they came from, what they opened, and what they tried
              on Puse.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Private path · not linked in the public nav ·{" "}
              <Link href="/" className="text-accent-solid hover:underline">
                back to app
              </Link>
            </p>
          </div>
          <OwnerLogoutButton />
        </div>
      </Reveal>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Unique visitors", value: uniqueSessions.length },
          { label: "Total events", value: totalEvents },
          { label: "Skin AI starts", value: skinStarts },
          { label: "Try-on starts", value: tryOnStarts },
        ].map((stat, i) => (
          <Reveal key={stat.label} delay={i * 50}>
            <Card className="p-5">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{stat.label}</p>
              <p className="mt-2 font-display text-3xl font-semibold text-accent-solid">
                {stat.value}
              </p>
            </Card>
          </Reveal>
        ))}
      </section>

      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section>
          <Reveal>
            <h2 className="mb-5 font-display text-2xl font-semibold tracking-tight">
              Recent visitors
            </h2>
          </Reveal>
          {visitors.length === 0 ? (
            <Card className="p-6 text-sm text-muted-foreground">
              No visitors tracked yet. Open the home page or run a Skin AI analysis — events
              will show up here.
            </Card>
          ) : (
            <div className="flex flex-col gap-3">
              {visitors.map((v, i) => (
                <Reveal key={v.sessionId} delay={Math.min(i * 40, 240)}>
                  <Card className="p-4 sm:p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-sm text-accent-solid">
                            {shortSession(v.sessionId)}
                          </span>
                          <Badge>{v.device}</Badge>
                        </div>
                        <p className="mt-1.5 text-sm font-medium">{v.location}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Trying: {v.actions.slice(0, 3).join(" · ")}
                        </p>
                        {v.paths.length > 0 && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            Pages: {v.paths.slice(0, 4).join(", ")}
                          </p>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{relativeTime(v.lastAt)}</p>
                    </div>
                  </Card>
                </Reveal>
              ))}
            </div>
          )}
        </section>

        <div className="flex flex-col gap-10">
          <section>
            <Reveal>
              <h2 className="mb-5 font-display text-2xl font-semibold tracking-tight">
                Where from
              </h2>
            </Reveal>
            {countriesRaw.length === 0 ? (
              <Card className="p-6 text-sm text-muted-foreground">No geo data yet.</Card>
            ) : (
              <Card className="flex flex-col gap-4 p-5">
                {countriesRaw.map((row) => {
                  const name = row.country || "Unknown";
                  const count = row._count._all;
                  const pct = Math.round((count / maxCountry) * 100);
                  return (
                    <div key={name}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span>{name}</span>
                        <span className="text-muted-foreground">{count}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full pulse-gradient-bg"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </Card>
            )}
          </section>

          <section>
            <Reveal>
              <h2 className="mb-5 font-display text-2xl font-semibold tracking-tight">
                Activity feed
              </h2>
            </Reveal>
            <Card className="divide-y divide-border overflow-hidden">
              {events.length === 0 && (
                <p className="p-5 text-sm text-muted-foreground">Waiting for first event…</p>
              )}
              {events.slice(0, 30).map((event) => (
                <div
                  key={event.id}
                  className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {event.label || actionLabel(event.action)}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      <span className="font-mono">{shortSession(event.sessionId)}</span>
                      {" · "}
                      {locationLabel({
                        city: event.city,
                        region: event.region,
                        country: event.country,
                      })}
                      {event.path ? ` · ${event.path}` : ""}
                    </p>
                  </div>
                  <p className="shrink-0 text-xs text-muted-foreground">
                    {relativeTime(event.createdAt)}
                  </p>
                </div>
              ))}
            </Card>
            {pageViews > 0 && (
              <p className="mt-3 text-xs text-muted-foreground">
                Showing latest {Math.min(events.length, 30)} of {totalEvents} events.
              </p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
