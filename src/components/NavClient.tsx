"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { useBag } from "@/lib/bag";

const LINKS = [
  { href: "/analyze", label: "Skin AI" },
  { href: "/catalog", label: "Shop" },
  { href: "/bag", label: "Bag" },
  { href: "/history", label: "History" },
];

export function NavClient({
  user,
}: {
  user: { email: string; name: string | null } | null;
}) {
  const pathname = usePathname();
  const { count, ready } = useBag();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/75 backdrop-blur-md">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo size={28} />
          <span className="font-display text-xl font-semibold tracking-tight">Puse</span>
        </Link>
        <div className="flex items-center gap-1">
          {LINKS.map((link) => {
            const active =
              pathname === link.href ||
              pathname.startsWith(`${link.href}/`) ||
              (link.href === "/catalog" &&
                (pathname.startsWith("/shop") || pathname.startsWith("/try-on"))) ||
              (link.href === "/bag" && pathname.startsWith("/checkout"));
            const label =
              link.href === "/bag" && ready && count > 0 ? `Bag (${count})` : link.label;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-2 text-sm font-medium transition sm:px-4 ${
                  active
                    ? "text-accent-solid shadow-[inset_0_-2px_0_0_var(--accent-solid)]"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {label}
              </Link>
            );
          })}
          <Link
            href="/account"
            className={`ml-1 rounded-full px-3 py-2 text-sm font-medium transition sm:px-4 ${
              pathname.startsWith("/account")
                ? "text-accent-solid shadow-[inset_0_-2px_0_0_var(--accent-solid)]"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
            title={user?.email}
          >
            {user ? user.name?.split(" ")[0] || "Account" : "Sign in"}
          </Link>
        </div>
      </nav>
    </header>
  );
}
