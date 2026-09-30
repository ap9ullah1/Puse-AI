import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { Reveal } from "@/components/Reveal";
import { AccountForm } from "./account-form";
import { LogoutButton } from "@/components/LogoutButton";
import { Card } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; next?: string }>;
}) {
  const user = await getCurrentUser();
  const params = await searchParams;
  const mode = params.mode === "register" ? "register" : "login";
  const nextPath = params.next?.startsWith("/") ? params.next : "/history";

  if (user) {
    return (
      <main className="mx-auto flex max-w-lg flex-col gap-8 px-6 py-16 sm:px-10">
        <Reveal>
          <Link href="/" className="text-sm text-muted-foreground hover:text-accent-solid">
            ← Back
          </Link>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">Your account</h1>
          <p className="mt-2 text-muted-foreground">Signed in — your generated results stay saved.</p>
        </Reveal>

        <Reveal>
          <Card className="flex flex-col gap-4 p-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Email</p>
              <p className="mt-1 font-medium">{user.email}</p>
            </div>
            {user.name && (
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Name</p>
                <p className="mt-1 font-medium">{user.name}</p>
              </div>
            )}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/history"
                className="nova-ring-btn rounded-full px-5 py-2.5 text-sm font-medium"
              >
                View saved results
              </Link>
              <LogoutButton />
            </div>
          </Card>
        </Reveal>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-lg flex-col gap-8 px-6 py-16 sm:px-10">
      <Reveal>
        <Link href="/" className="text-sm text-muted-foreground hover:text-accent-solid">
          ← Back
        </Link>
      </Reveal>
      <Reveal>
        <AccountForm initialMode={mode} nextPath={nextPath} />
      </Reveal>
    </main>
  );
}
