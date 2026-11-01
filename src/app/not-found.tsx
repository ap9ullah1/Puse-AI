import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <span className="puse-gradient-text font-display text-6xl font-semibold">404</span>
      <h1 className="font-display text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="max-w-sm text-muted-foreground">
        We couldn&apos;t find that page. It may have moved, or the link might be wrong.
      </p>
      <Link href="/" className={buttonVariants("primary", "md")}>
        Back to Puse AI
      </Link>
    </main>
  );
}
