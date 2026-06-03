"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, ShieldCheck } from "lucide-react";

interface OrderActionsProps {
  order: { id: string; status: string };
  role: string;
  onUpdate: () => void;
}

export function OrderActions({ order, role, onUpdate }: OrderActionsProps) {
  const [isPending, start] = useTransition();

  const updateStatus = (status: string) => {
    start(async () => {
      const toastId = toast.loading("Updating order status...");
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success("Order status updated successfully.", { id: toastId });
        onUpdate();
      } else {
        toast.error("Failed to update status.", { id: toastId });
      }
    });
  };

  if (role === "BUYER") return null;

  const isSellerOrAdmin = role === "SELLER" || role === "ADMIN";

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-4">
      <p className="text-sm font-medium text-muted-foreground mr-auto">
        Quotation Workflow Actions
      </p>

      {isSellerOrAdmin && order.status === "PENDING" && (
        <>
          <Button
            size="sm"
            variant="default"
            disabled={isPending}
            onClick={() => updateStatus("APPROVED")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white border-none"
          >
            <CheckCircle className="mr-1.5 h-3.5 w-3.5" /> Approve Quote
          </Button>

          <Button
            size="sm"
            variant="destructive"
            disabled={isPending}
            onClick={() => updateStatus("REJECTED")}
          >
            <XCircle className="mr-1.5 h-3.5 w-3.5" /> Reject Quote
          </Button>
        </>
      )}

      {isSellerOrAdmin && order.status === "APPROVED" && (
        <Button
          size="sm"
          variant="default"
          disabled={isPending}
          onClick={() => updateStatus("COMPLETED")}
        >
          <ShieldCheck className="mr-1.5 h-3.5 w-3.5" /> Complete Order
        </Button>
      )}

      {order.status === "COMPLETED" && (
        <span className="text-xs text-muted-foreground italic">
          This order has been completed and archived.
        </span>
      )}

      {order.status === "REJECTED" && (
        <span className="text-xs text-destructive italic">
          This quotation has been rejected.
        </span>
      )}
    </div>
  );
}
