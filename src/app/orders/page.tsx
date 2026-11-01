import Link from "next/link";
import { ChevronLeft, Package } from "lucide-react";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { readSessionId } from "@/lib/session";
import { orderStatusLabel } from "@/lib/commerce";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/Reveal";
import { LightboxImage } from "@/components/ui/LightboxImage";
import { buttonVariants } from "@/components/ui/button-variants";

export const dynamic = "force-dynamic";

type OrderItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
  kind: string;
  size?: string;
  image?: string;
  tryOnUrl?: string;
};

export default async function OrdersPage() {
  const user = await getCurrentUser();
  const sessionId = await readSessionId();

  const orders = user
    ? await prisma.order.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 40,
      })
    : sessionId
      ? await prisma.order.findMany({
          where: { sessionId },
          orderBy: { createdAt: "desc" },
          take: 40,
        })
      : [];

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-16 sm:px-10">
      <Reveal>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-accent-solid"
        >
          <ChevronLeft className="h-4 w-4" />
          Shop
        </Link>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Orders
        </h1>
        <p className="mt-3 text-muted-foreground">
          {user
            ? `Orders for ${user.email}. Try-on looks stay attached to each line.`
            : "Orders placed on this browser. Sign in to keep them — and your try-on looks — on your account."}
        </p>
      </Reveal>

      {orders.length === 0 ? (
        <Card className="flex flex-col gap-4 p-6">
          <Package className="h-5 w-5 text-accent-solid" />
          <p className="text-sm text-muted-foreground">No orders yet.</p>
          <Link href="/catalog" className={buttonVariants("primary", "md")}>
            Start shopping
          </Link>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order, i) => {
            const items = JSON.parse(order.items) as OrderItem[];
            return (
              <Reveal key={order.id} delay={Math.min(i * 40, 200)}>
                <Card className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-sm text-accent-solid">{order.id}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {order.createdAt.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge>{orderStatusLabel(order.status)}</Badge>
                      <p className="font-medium">${order.total}</p>
                    </div>
                  </div>
                  <ul className="mt-4 space-y-3">
                    {items.map((item) => (
                      <li
                        key={`${item.productId}-${item.size ?? "os"}`}
                        className="flex gap-3 text-sm"
                      >
                        {(item.tryOnUrl || item.image) && (
                          <LightboxImage
                            src={item.tryOnUrl || item.image!}
                            alt={item.tryOnUrl ? `${item.name} try-on look` : item.name}
                            className="h-16 w-14 shrink-0 rounded-lg object-cover"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-foreground">
                            {item.qty}× {item.name}
                          </p>
                          <p className="text-muted-foreground">
                            {item.size ? `Size ${item.size} · ` : ""}
                            ${item.price * item.qty}
                          </p>
                          {item.tryOnUrl && (
                            <p className="mt-0.5 text-xs text-accent-solid">Your try-on look saved</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                  {(order.discount > 0 || order.couponCode) && (
                    <p className="mt-3 text-xs text-accent-solid">
                      {order.couponCode ? `${order.couponCode} applied · ` : ""}
                      saved ${order.discount}
                    </p>
                  )}
                </Card>
              </Reveal>
            );
          })}
        </div>
      )}
    </main>
  );
}
