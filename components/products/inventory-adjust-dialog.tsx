"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sliders } from "lucide-react";

interface Product {
  id: string;
  name: string;
  dimension: string;
  stockBaseQty: string;
}

interface InventoryAdjustDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSaved: () => void;
}

const UNIT_LABELS: Record<string, string> = {
  WEIGHT: "g",
  VOLUME: "mL",
  COUNT: "units",
};

export function InventoryAdjustDialog({
  open,
  onOpenChange,
  product,
  onSaved,
}: InventoryAdjustDialogProps) {
  const [stock, setStock] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (product) {
      setStock(Number(product.stockBaseQty).toString());
    } else {
      setStock("");
    }
  }, [product, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    const amount = Number(stock);
    if (isNaN(amount) || amount < 0) {
      toast.error("Please enter a valid non-negative stock quantity");
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch(`/api/products/${product.id}/inventory`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stockBaseQty: stock }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to update inventory level");
        }

        toast.success("Stock level updated successfully!");
        onSaved();
      } catch (err: any) {
        toast.error(err.message || "An unexpected error occurred");
      }
    });
  };

  const unit = product ? (UNIT_LABELS[product.dimension] ?? "") : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-serif flex items-center gap-1.5">
            <Sliders className="h-5 w-5 text-primary" /> Adjust Inventory Level
          </DialogTitle>
          <DialogDescription className="text-xs">
            Modify the canonical base stock for <span className="font-semibold text-foreground">{product?.name}</span>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="stock-qty-adjust">
              Base Stock Quantity (in {unit})
            </Label>
            <div className="relative">
              <Input
                id="stock-qty-adjust"
                type="number"
                step="any"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
                disabled={isPending}
                className="bg-input border-border pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground select-none">
                {unit}
              </span>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              size="sm"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} size="sm">
              {isPending ? "Saving..." : "Save Adjustments"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
