import { redirect } from "next/navigation";

/** Alias so ecommerce is discoverable at /shop as well as /catalog. */
export default function ShopIndexRedirect() {
  redirect("/catalog");
}
