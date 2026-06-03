"use client";

import { useEffect, useState } from "react";
import { Package, ShoppingBag, Users, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/layout/stat-card";
import { OrderList } from "@/components/orders/order-list";
import { PageSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { SessionPayload } from "@/lib/auth";

export function AdminDashboard({ session }: { session: SessionPayload }) {
    const [orders, setOrders]     = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [users, setUsers]       = useState<any[]>([]);
    const [loading, setLoading]   = useState(true);

    useEffect(() => {
        Promise.all([
            fetch("/api/orders").then((r) => r.json()),
            fetch("/api/products").then((r) => r.json()),
            fetch("/api/users").then((r) => r.json()),
        ]).then(([o, p, u]) => {
            setOrders(o.items ?? []);
            setProducts(p.items ?? []);
            setUsers(u.items ?? []);
        }).finally(() => setLoading(false));
    }, []);

    if (loading) return <PageSkeleton />;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-serif text-2xl font-semibold text-foreground">
                        Admin Dashboard
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Full system overview.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/admin/users">Manage Users</Link>
                    </Button>
                    <Button size="sm" asChild>
                        <Link href="/admin/products">Add Product</Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatCard label="Total Orders"   value={orders.length}   icon={ShoppingBag} />
                <StatCard label="Products"       value={products.length} icon={Package}     />
                <StatCard label="Users"          value={users.length}    icon={Users}       />
                <StatCard label="Pending Orders" value={orders.filter((o) => o.status === "PENDING").length} icon={TrendingUp} />
            </div>

            <section>
                <h2 className="mb-4 font-serif text-lg font-semibold text-foreground">
                    All Recent Orders
                </h2>
                <OrderList orders={orders.slice(0, 8)} showBuyer />
            </section>
        </div>
    );
}
