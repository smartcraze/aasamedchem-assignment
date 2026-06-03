"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { StatusBadge } from "@/components/shared/badges";
import { PageSkeleton } from "@/components/shared/loading-skeleton";
import { OrderItemsTable } from "@/components/orders/order-items-table";
import { OrderActions } from "@/components/orders/order-actions";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useSession } from "@/lib/hooks/use-session";

export default function OrderDetailPage() {
    const { id }             = useParams<{ id: string }>();
    const router             = useRouter();
    const { session }        = useSession();
    const [order, setOrder]  = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchOrder = () =>
        fetch(`/api/orders/${id}`)
            .then((r) => r.json())
            .then(setOrder)
            .finally(() => setLoading(false));

    useEffect(() => { fetchOrder(); }, [id]);

    if (loading) return <PageSkeleton />;
    if (!order)  return <p className="p-8 text-muted-foreground">Order not found.</p>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="font-serif text-xl font-semibold text-foreground">
                        Order <span className="font-mono text-base text-muted-foreground">#{order.id.slice(0, 8)}</span>
                    </h1>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(order.createdAt).toLocaleString("en-IN")}
                    </p>
                </div>
                <StatusBadge status={order.status} />
            </div>

            {/* Order meta */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 rounded-xl border border-border bg-card p-5">
                <div><p className="text-xs text-muted-foreground">Buyer</p>
                    <p className="text-sm font-medium text-foreground mt-0.5">{order.buyer?.name ?? "—"}</p></div>
                <div><p className="text-xs text-muted-foreground">Seller</p>
                    <p className="text-sm font-medium text-foreground mt-0.5">{order.seller?.name ?? "Unassigned"}</p></div>
                <div><p className="text-xs text-muted-foreground">Total Amount</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">
                        ₹{Number(order.totalAmount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </p></div>
            </div>

            <OrderItemsTable items={order.items ?? []} />

            {session && <OrderActions order={order} role={session.role} onUpdate={fetchOrder} />}
        </div>
    );
}
