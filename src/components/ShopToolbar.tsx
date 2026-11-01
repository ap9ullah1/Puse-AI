import { Search, SlidersHorizontal } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";

export function ShopToolbar({
  action,
  q = "",
  sort = "featured",
  vto = false,
}: {
  action: string;
  q?: string;
  sort?: string;
  vto?: boolean;
}) {
  return (
    <form
      action={action}
      className="flex flex-col gap-3 rounded-[var(--radius)] border border-border bg-card p-4 sm:flex-row sm:items-center"
    >
      <label className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          name="q"
          defaultValue={q}
          placeholder="Search skincare, dresses, try-on…"
          className="w-full rounded-full border border-border bg-muted/40 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-accent-solid"
        />
      </label>
      <select
        name="sort"
        defaultValue={sort}
        aria-label="Sort products"
        className="rounded-full border border-border bg-muted/40 px-4 py-2.5 text-sm outline-none focus:border-accent-solid"
      >
        <option value="featured">Featured</option>
        <option value="price-asc">Price: low to high</option>
        <option value="price-desc">Price: high to low</option>
        <option value="name">Name</option>
      </select>
      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input
          type="checkbox"
          name="vto"
          value="1"
          defaultChecked={vto}
          className="h-4 w-4 accent-[var(--accent-solid)]"
        />
        Try-on only
      </label>
      <button type="submit" className={buttonVariants("outline", "md")}>
        <SlidersHorizontal className="h-4 w-4" />
        Apply
      </button>
    </form>
  );
}
