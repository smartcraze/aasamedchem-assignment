"use client";

import { useEffect, useState } from "react";
import { Package, ShoppingBag, Clock, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/layout/stat-card";
import { OrderList } from "@/components/orders/order-list";
import { PageSkeleton } from "@/components/shared/loading-skeleton";
import type { SessionPayload } from "@/lib/auth";

interface BuyerDashboardProps {
    session: SessionPayload;
}

export function BuyerDashboard({ session }: BuyerDashboardProps) {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/orders")
            .then((r) => r.json())
            .then((data) => setOrders(Array.isArray(data) ? data : []))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <PageSkeleton />;

    const pending   = orders.filter((o) => o.status === "PENDING").length;
    const delivered = orders.filter((o) => o.status === "DELIVERED").length;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="font-serif text-2xl font-semibold text-foreground">
                    Welcome back, {session.name.split(" ")[0]}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Track your orders and browse the catalogue.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatCard label="Total Orders"   value={orders.length} icon={ShoppingBag} />
                <StatCard label="Pending"        value={pending}       icon={Clock}       />
                <StatCard label="Delivered"      value={delivered}     icon={TrendingUp}  />
                <StatCard label="Products"       value="Browse"        icon={Package}     />
            </div>

            {/* Recent orders */}
            <section>
                <h2 className="mb-4 font-serif text-lg font-semibold text-foreground">
                    Recent Orders
                </h2>
                <OrderList orders={orders.slice(0, 5)} />
            </section>
        </div>
    );
}
