"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Calculator, ShoppingBag } from "lucide-react";

interface Item {
  productId: string;
  name: string;
  qty: number;
  unit: string;
}

interface CreateOrderSummaryProps {
  items: Item[];
  onRemove: (index: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const UNIT_LABELS: Record<string, string> = {
  G: "g",
  KG: "kg",
  ML: "mL",
  L: "L",
  UNIT: "units",
};

export function CreateOrderSummary({ items, onRemove, onSubmit, isSubmitting }: CreateOrderSummaryProps) {
  const [totals, setTotals] = useState<{ items: any[]; totalAmount: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      setTotals(null);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      fetch("/api/orders/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((it) => ({
            productId: it.productId,
            orderedQty: it.qty,
            orderedUnit: it.unit,
          })),
        }),
      })
        .then((r) => {
          if (!r.ok) throw new Error("Preview failed");
          return r.json();
        })
        .then(setTotals)
        .catch(() => setTotals(null))
        .finally(() => setLoading(false));
    }, 400);

    return () => clearTimeout(timer);
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/10 p-8 text-center text-muted-foreground text-sm italic">
        No compounds added to this request yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead>Compound</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead className="text-right">Est. Price</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, idx) => {
              const previewItem = totals?.items?.[idx];
              return (
                <TableRow key={`${item.productId}-${idx}`} className="hover:bg-muted/10">
                  <TableCell className="font-serif font-medium text-foreground">{item.name}</TableCell>
                  <TableCell className="font-mono text-sm">{item.qty}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{UNIT_LABELS[item.unit] ?? item.unit}</TableCell>
                  <TableCell className="text-right font-semibold text-primary">
                    {previewItem ? `₹${Number(previewItem.totalPrice).toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => onRemove(idx)} className="h-8 w-8 text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calculator className="h-3.5 w-3.5" /> Total Price Calculation
          </span>
          {loading && <span className="animate-pulse">Updating...</span>}
        </div>

        {totals ? (
          <div className="flex justify-between items-baseline pt-2 border-t border-border">
            <span className="text-sm font-medium text-foreground">Estimated Total Amount:</span>
            <span className="text-2xl font-bold text-primary font-serif">
              ₹{Number(totals.totalAmount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>
        ) : (
          <p className="text-sm italic text-muted-foreground text-center py-2">
            Loading preview amounts...
          </p>
        )}

        <Button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting || items.length === 0}
          className="w-full shadow-sm gap-2"
        >
          <ShoppingBag className="h-4 w-4" />
          {isSubmitting ? "Submitting Quotation..." : "Request Quotation"}
        </Button>
      </div>
    </div>
  );
}
