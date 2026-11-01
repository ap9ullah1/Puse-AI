import { canTryOn, type Product } from "./products";

export type CatalogQuery = {
  q?: string;
  sort?: string;
  vto?: string;
};

export function filterCatalog(products: Product[], query: CatalogQuery): Product[] {
  const q = (query.q ?? "").trim().toLowerCase();
  const vtoOnly = query.vto === "1";
  let list = products;

  if (q) {
    list = list.filter((product) => {
      const concern = "concern" in product && product.concern ? product.concern : "";
      return [product.name, product.description, product.category, product.kind, concern]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }

  if (vtoOnly) list = list.filter(canTryOn);

  const sort = query.sort ?? "featured";
  return [...list].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "name") return a.name.localeCompare(b.name);
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}
