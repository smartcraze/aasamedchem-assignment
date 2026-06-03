"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/hooks/use-session";
import { OrderList } from "@/components/orders/order-list";
import { PageSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Plus } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const STATUSES = ["ALL", "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function OrdersPage() {
    const { status } = useSession();
    const [orders, setOrders]   = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab]         = useState("ALL");

    useEffect(() => {
        fetch("/api/orders")
            .then((r) => r.json())
            .then((d) => setOrders(d.items ?? []))
            .finally(() => setLoading(false));
    }, []);

    if (status === "loading" || loading) return <PageSkeleton />;

    const filtered = tab === "ALL" ? orders : orders.filter((o) => o.status === tab);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-serif text-2xl font-semibold text-foreground flex items-center gap-2">
                        <ShoppingBag className="h-6 w-6 text-primary" />
                        Orders
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {orders.length} order{orders.length !== 1 ? "s" : ""} total
                    </p>
                </div>
                <Button size="sm" asChild>
                    <Link href="/orders/new">
                        <Plus className="mr-1.5 h-4 w-4" /> New Order
                    </Link>
                </Button>
            </div>

            <Tabs value={tab} onValueChange={setTab}>
                <TabsList className="bg-muted/50 flex-wrap gap-1 h-auto p-1">
                    {STATUSES.map((s) => (
                        <TabsTrigger key={s} value={s} className="text-xs capitalize">
                            {s === "ALL" ? `All (${orders.length})` : s.charAt(0) + s.slice(1).toLowerCase()}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {STATUSES.map((s) => (
                    <TabsContent key={s} value={s} className="mt-4">
                        <OrderList orders={filtered} showBuyer />
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
