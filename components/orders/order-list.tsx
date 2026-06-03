"use client";

import Link from "next/link";
import { StatusBadge } from "@/components/shared/badges";
import { EmptyState } from "@/components/shared/empty-state";
import { ShoppingBag } from "lucide-react";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

interface Order {
    id: string;
    status: string;
    totalAmount: string;
    createdAt: string;
    buyer?: { name: string };
}

interface OrderListProps {
    orders: Order[];
    showBuyer?: boolean;
}

export function OrderList({ orders, showBuyer = false }: OrderListProps) {
    if (orders.length === 0) {
        return (
            <EmptyState
                icon={ShoppingBag}
                title="No orders yet"
                description="Orders placed through the platform will appear here."
            />
        );
    }

    return (
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableHead className="font-medium text-muted-foreground">Order ID</TableHead>
                        {showBuyer && <TableHead className="font-medium text-muted-foreground">Buyer</TableHead>}
                        <TableHead className="font-medium text-muted-foreground">Status</TableHead>
                        <TableHead className="font-medium text-muted-foreground">Amount</TableHead>
                        <TableHead className="font-medium text-muted-foreground">Date</TableHead>
                        <TableHead />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.id} className="group hover:bg-muted/20 transition-colors">
                            <TableCell className="font-mono text-xs text-muted-foreground">
                                #{order.id.slice(0, 8)}
                            </TableCell>
                            {showBuyer && (
                                <TableCell className="text-sm text-foreground">
                                    {order.buyer?.name ?? "—"}
                                </TableCell>
                            )}
                            <TableCell><StatusBadge status={order.status} /></TableCell>
                            <TableCell className="text-sm font-medium text-foreground">
                                ₹{Number(order.totalAmount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString("en-IN")}
                            </TableCell>
                            <TableCell>
                                <Link
                                    href={`/orders/${order.id}`}
                                    className="text-xs text-primary hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    View →
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
