"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Truck, Package } from "lucide-react";

const SELLER_TRANSITIONS: Record<string, string> = {
    PENDING:    "CONFIRMED",
    CONFIRMED:  "PROCESSING",
    PROCESSING: "SHIPPED",
    SHIPPED:    "DELIVERED",
};

const STATUS_LABELS: Record<string, string> = {
    CONFIRMED:  "Confirm",
    PROCESSING: "Mark Processing",
    SHIPPED:    "Mark Shipped",
    DELIVERED:  "Mark Delivered",
};

interface OrderActionsProps {
    order: { id: string; status: string };
    role: string;
    onUpdate: () => void;
}

export function OrderActions({ order, role, onUpdate }: OrderActionsProps) {
    const [isPending, start] = useTransition();
    const nextStatus = SELLER_TRANSITIONS[order.status];

    const updateStatus = (status: string) => {
        start(async () => {
            const toastId = toast.loading("Updating order…");
            const res = await fetch(`/api/orders/${order.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            if (res.ok) {
                toast.success("Order updated.", { id: toastId });
                onUpdate();
            } else {
                toast.error("Update failed.", { id: toastId });
            }
        });
    };

    if (role === "BUYER") return null;

    return (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-4">
            <p className="text-sm font-medium text-muted-foreground mr-auto">Order Actions</p>

            {(role === "SELLER" || role === "ADMIN") && nextStatus && (
                <Button size="sm" disabled={isPending} onClick={() => updateStatus(nextStatus)}>
                    <Package className="mr-1.5 h-3.5 w-3.5" />
                    {STATUS_LABELS[nextStatus] ?? nextStatus}
                </Button>
            )}

            {(role === "ADMIN") && order.status === "PENDING" && (
                <Button
                    size="sm" variant="destructive" disabled={isPending}
                    onClick={() => updateStatus("CANCELLED")}
                >
                    <XCircle className="mr-1.5 h-3.5 w-3.5" /> Cancel
                </Button>
            )}
        </div>
    );
}
