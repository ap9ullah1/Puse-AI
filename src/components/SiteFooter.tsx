import Link from "next/link";
import { History, ScanFace, Shirt, ShoppingBag } from "lucide-react";
import { Logo } from "./Logo";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { href: "/catalog", label: "All products" },
      { href: "/shop/category/skincare", label: "Skincare" },
      { href: "/catalog?vto=1", label: "Virtual try-on" },
      { href: "/bag", label: "Bag" },
    ],
  },
  {
    title: "You",
    links: [
      { href: "/analyze", label: "Skin AI" },
      { href: "/orders", label: "Orders" },
      { href: "/history", label: "Looks" },
      { href: "/account", label: "Account" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:px-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex flex-col gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo size={36} />
            <span className="font-display text-xl font-semibold tracking-tight">Puse AI</span>
          </Link>
          <p className="max-w-xs text-sm text-muted-foreground">
            Skin analysis, virtual try-on, and checkout in one store. Powered by YouCam.
          </p>
          <div className="mt-2 flex gap-3 text-muted-foreground">
            <Link href="/analyze" aria-label="Skin AI" className="hover:text-accent-solid">
              <ScanFace className="h-4 w-4" />
            </Link>
            <Link href="/catalog?vto=1" aria-label="Try on" className="hover:text-accent-solid">
              <Shirt className="h-4 w-4" />
            </Link>
            <Link href="/bag" aria-label="Bag" className="hover:text-accent-solid">
              <ShoppingBag className="h-4 w-4" />
            </Link>
            <Link href="/history" aria-label="Looks" className="hover:text-accent-solid">
              <History className="h-4 w-4" />
            </Link>
          </div>
        </div>
        {COLUMNS.map((column) => (
          <div key={column.title}>
            <p className="text-xs font-semibold uppercase tracking-wider text-accent-solid">
              {column.title}
            </p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-6xl px-6 py-4 text-xs text-muted-foreground sm:px-10">
          © 2026 Puse AI · Powered by YouCam Skin AI and Clothes Virtual Try-On
        </p>
      </div>
    </footer>
  );
}
