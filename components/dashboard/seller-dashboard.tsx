"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, CheckCircle, Clock, Users } from "lucide-react";
import { StatCard } from "@/components/layout/stat-card";
import { OrderList } from "@/components/orders/order-list";
import { PageSkeleton } from "@/components/shared/loading-skeleton";
import type { SessionPayload } from "@/lib/auth";

export function SellerDashboard({ session }: { session: SessionPayload }) {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/orders")
            .then((r) => r.json())
            .then((data) => setOrders(data.items ?? []))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <PageSkeleton />;

    const pending   = orders.filter((o) => o.status === "PENDING").length;
    const approved  = orders.filter((o) => o.status === "APPROVED").length;
    const completed = orders.filter((o) => o.status === "COMPLETED").length;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="font-serif text-2xl font-semibold text-foreground">
                    Seller Dashboard
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Manage and fulfil your assigned orders.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatCard label="Total Orders" value={orders.length} icon={ShoppingBag} />
                <StatCard label="Pending"      value={pending}       icon={Clock}       />
                <StatCard label="Approved"     value={approved}      icon={CheckCircle} />
                <StatCard label="Completed"    value={completed}     icon={Users}       />
            </div>

            <section>
                <h2 className="mb-4 font-serif text-lg font-semibold text-foreground">
                    Orders to Fulfil
                </h2>
                <OrderList orders={orders} />
            </section>
        </div>
    );
}
