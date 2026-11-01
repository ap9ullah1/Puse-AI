"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Clock,
  Menu,
  Package,
  ScanFace,
  Search,
  Shirt,
  ShoppingBag,
  Store,
  User,
  X,
} from "lucide-react";
import { Logo } from "./Logo";
import { useBag } from "@/lib/bag";

const LINKS = [
  { href: "/analyze", label: "Skin AI", icon: ScanFace },
  { href: "/catalog", label: "Shop", icon: Store },
  { href: "/catalog?vto=1", label: "Try on", icon: Shirt, match: "/try-on" },
  { href: "/orders", label: "Orders", icon: Package },
  { href: "/history", label: "Looks", icon: Clock },
];

function isActive(pathname: string, href: string, match?: string) {
  if (href.includes("?")) {
    return Boolean(match && (pathname === match || pathname.startsWith(`${match}/`)));
  }
  if (pathname === href || pathname.startsWith(`${href}/`)) return true;
  if (href === "/catalog" && pathname.startsWith("/shop")) return true;
  if (href === "/bag" && pathname.startsWith("/checkout")) return true;
  return false;
}

export function NavClient({
  user,
}: {
  user: { email: string; name: string | null } | null;
}) {
  const pathname = usePathname();
  const { count, ready } = useBag();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Close the mobile menu/search during render (not in an effect) when the
  // route changes, so there's no flash of the open menu on the new page.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
    setSearchOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const bagActive = pathname === "/bag" || pathname.startsWith("/checkout");

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo size={36} />
          <span className="font-display text-xl font-semibold tracking-tight">Puse AI</span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => {
            const active = isActive(pathname, link.href, link.match);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "text-accent-solid shadow-[inset_0_-2px_0_0_var(--accent-solid)]"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={1.75} />
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Search the shop"
            onClick={() => setSearchOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground lg:hidden"
          >
            <Search className="h-4 w-4" />
          </button>

          <form action="/catalog" className="relative hidden lg:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              name="q"
              placeholder="Search"
              aria-label="Search the shop"
              className="w-40 rounded-full border border-border bg-muted/40 py-2 pl-9 pr-3 text-sm outline-none transition focus:w-56 focus:border-accent-solid xl:w-52"
            />
          </form>

          <Link
            href="/bag"
            aria-label={ready && count > 0 ? `Bag, ${count} items` : "Bag"}
            className={`relative flex h-10 w-10 items-center justify-center rounded-full transition ${
              bagActive
                ? "text-accent-solid"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            {ready && count > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-solid px-1 text-[10px] font-semibold text-[var(--accent-solid-foreground)]">
                {count > 9 ? "9+" : count}
              </span>
            )}
          </Link>

          <Link
            href="/account"
            aria-label={user ? "Account" : "Sign in"}
            title={user?.email}
            className={`hidden h-10 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition sm:inline-flex ${
              pathname.startsWith("/account")
                ? "text-accent-solid"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <User className="h-4 w-4" />
            <span className="max-w-24 truncate">
              {user ? user.name?.split(" ")[0] || "Account" : "Sign in"}
            </span>
          </Link>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {searchOpen && (
        <form action="/catalog" className="border-t border-border px-4 py-3 lg:hidden">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              name="q"
              autoFocus
              placeholder="Search skincare, dresses, try-on…"
              aria-label="Search the shop"
              className="w-full rounded-full border border-border bg-muted/40 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-accent-solid"
            />
          </label>
        </form>
      )}

      {open && (
        <div className="border-t border-border bg-background px-4 py-3 lg:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1">
            {LINKS.map((link) => {
              const active = isActive(pathname, link.href, link.match);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium ${
                    active ? "bg-muted text-accent-solid" : "text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/account"
              className="inline-flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium hover:bg-muted sm:hidden"
            >
              <User className="h-4 w-4" />
              {user ? user.name?.split(" ")[0] || "Account" : "Sign in"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
