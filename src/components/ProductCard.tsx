import Link from "next/link";
import { Shirt } from "lucide-react";
import { canTryOn, type Product } from "@/lib/products";
import { Card } from "@/components/ui/Card";
import { ProductImage } from "@/components/ui/ProductImage";
import { Badge } from "@/components/ui/Badge";
import { AddToBagButton } from "@/components/AddToBagButton";
import { buttonVariants } from "@/components/ui/button-variants";

export function ProductCard({ product }: { product: Product }) {
  const tryOn = canTryOn(product);
  const concern = "concern" in product ? product.concern : null;

  return (
    <Card className="flex h-full flex-col overflow-hidden p-3 transition hover:-translate-y-0.5 hover:border-accent-solid/40">
      <div className="relative mb-2">
        <ProductImage
          id={product.id}
          kind={product.kind}
          name={product.name}
          image={product.image}
          className="h-44 w-full rounded-[calc(var(--radius)-0.4rem)] sm:h-52"
        />
        {tryOn && (
          <Link
            href={`/try-on/${product.id}`}
            aria-label={`Try on ${product.name}`}
            className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-accent-solid shadow-[var(--shadow-soft)] transition hover:bg-background"
          >
            <Shirt className="h-4 w-4" />
          </Link>
        )}
      </div>
      <Link href={`/shop/${product.id}`} className="block">
        <div className="mb-1 flex flex-wrap gap-1">
          {tryOn && <Badge>Try on</Badge>}
          {concern && <Badge className="capitalize">{concern}</Badge>}
          {product.stock > 0 && product.stock <= 5 && <Badge>Only {product.stock} left</Badge>}
          {product.stock < 1 && <Badge>Sold out</Badge>}
        </div>
        <p className="text-sm font-medium hover:text-accent-solid">{product.name}</p>
        <p className="text-sm text-muted-foreground">${product.price}</p>
      </Link>
      <div className="mt-auto flex flex-col gap-2 pt-3">
        <AddToBagButton
          productId={product.id}
          name={product.name}
          price={product.price}
          image={product.image}
          kind={product.kind}
          category={product.category}
          stock={product.stock}
          vto={tryOn}
          className="w-full"
        />
        {tryOn ? (
          <Link href={`/try-on/${product.id}`} className={`${buttonVariants("outline", "md")} w-full`}>
            <Shirt className="h-4 w-4" />
            Try on
          </Link>
        ) : (
          <Link href={`/shop/${product.id}`} className={`${buttonVariants("ghost", "md")} w-full`}>
            Details
          </Link>
        )}
      </div>
    </Card>
  );
}
