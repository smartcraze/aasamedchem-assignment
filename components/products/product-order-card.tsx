"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, ShoppingCart } from "lucide-react";

interface Product {
  id: string;
  name: string;
  dimension: string;
  stockBaseQty: string;
  pricePerBaseUnit: string;
  isActive: boolean;
}

const UNIT_OPTIONS: Record<string, { label: string; value: string }[]> = {
  WEIGHT: [
    { label: "Grams (g)", value: "G" },
    { label: "Kilograms (kg)", value: "KG" },
  ],
  VOLUME: [
    { label: "Milliliters (mL)", value: "ML" },
    { label: "Liters (L)", value: "L" },
  ],
  COUNT: [{ label: "Units", value: "UNIT" }],
};

export function ProductOrderCard({ product }: { product: Product }) {
  const router = useRouter();
  const [qty, setQty] = useState<string>("1");
  const [unit, setUnit] = useState<string>(UNIT_OPTIONS[product.dimension]?.[0]?.value ?? "");
  const [preview, setPreview] = useState<{ totalPrice: string; baseQty: string } | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [isPending, startTransition] = useTransition();

  const options = UNIT_OPTIONS[product.dimension] ?? [];

  useEffect(() => {
    const amount = Number(qty);
    if (!qty || isNaN(amount) || amount <= 0 || !unit) {
      setPreview(null);
      return;
    }

    setLoadingPreview(true);
    const timer = setTimeout(() => {
      fetch("/api/orders/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ productId: product.id, orderedQty: amount, orderedUnit: unit }],
        }),
      })
        .then((r) => {
          if (!r.ok) throw new Error("Failed to load preview");
          return r.json();
        })
        .then((d) => {
          if (d.items && d.items[0]) {
            setPreview({
              totalPrice: d.items[0].totalPrice,
              baseQty: d.items[0].baseQty,
            });
          }
        })
        .catch(() => setPreview(null))
        .finally(() => setLoadingPreview(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [qty, unit, product.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(qty);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: [{ productId: product.id, orderedQty: amount, orderedUnit: unit }],
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to create quotation request");
        }

        const data = await response.json();
        toast.success("Quotation request submitted successfully!");
        router.push(`/orders/${data.id}`);
        router.refresh();
      } catch (err: any) {
        toast.error(err.message || "An unexpected error occurred");
      }
    });
  };

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="font-serif text-lg font-semibold flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-primary" /> Request Quotation
        </CardTitle>
        <CardDescription>
          Specify your quantity and unit to generate an instant pricing preview.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="qty-input">Quantity</Label>
            <Input
              id="qty-input"
              type="number"
              step="any"
              min="0.000001"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              required
              className="bg-input border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit-select">Unit</Label>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger id="unit-select" className="bg-input border-border">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Pricing calculations preview section */}
          <div className="rounded-xl border border-dashed border-border/80 bg-muted/10 p-4 space-y-3">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calculator className="h-3.5 w-3.5" /> Est. Cost Breakdown
              </span>
              {loadingPreview && <span className="animate-pulse">Calculating...</span>}
            </div>

            {preview ? (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Converted Qty:</span>
                  <span className="font-mono">{Number(preview.baseQty).toFixed(4)} {product.dimension === "WEIGHT" ? "g" : product.dimension === "VOLUME" ? "mL" : "units"}</span>
                </div>
                <div className="flex justify-between items-baseline pt-1 border-t border-border/50">
                  <span className="text-sm font-medium text-foreground">Estimated Price:</span>
                  <span className="text-lg font-bold text-primary">
                    ₹{Number(preview.totalPrice).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs italic text-muted-foreground text-center py-2">
                Enter a quantity to see preview details.
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <Button type="submit" disabled={isPending || !preview} className="w-full shadow-sm">
            {isPending ? "Submitting..." : "Submit Quotation Request"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
