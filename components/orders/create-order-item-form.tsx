"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Info } from "lucide-react";

interface Product {
  id: string;
  name: string;
  dimension: string;
  pricePerBaseUnit: string;
}

interface CreateOrderItemFormProps {
  products: Product[];
  onAdd: (item: { productId: string; name: string; qty: number; unit: string }) => void;
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

export function CreateOrderItemForm({ products, onAdd }: CreateOrderItemFormProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [qty, setQty] = useState<string>("1");
  const [unit, setUnit] = useState<string>("");

  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const options = selectedProduct ? (UNIT_OPTIONS[selectedProduct.dimension] ?? []) : [];

  const handleProductChange = (productId: string) => {
    setSelectedProductId(productId);
    const prod = products.find((p) => p.id === productId);
    if (prod) {
      const defaultUnit = UNIT_OPTIONS[prod.dimension]?.[0]?.value ?? "";
      setUnit(defaultUnit);
    }
  };

  const handleAdd = () => {
    const amount = Number(qty);
    if (!selectedProductId || !selectedProduct) return;
    if (isNaN(amount) || amount <= 0) return;

    onAdd({
      productId: selectedProductId,
      name: selectedProduct.name,
      qty: amount,
      unit,
    });

    // Reset fields except selection
    setQty("1");
  };

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-5">
      <h3 className="font-serif text-sm font-semibold text-foreground flex items-center gap-1.5">
        <Info className="h-4 w-4 text-primary" /> Add Item Details
      </h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="item-product">Product</Label>
          <Select value={selectedProductId} onValueChange={handleProductChange}>
            <SelectTrigger id="item-product" className="bg-input border-border">
              <SelectValue placeholder="Select a compound..." />
            </SelectTrigger>
            <SelectContent>
              {products.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="item-qty">Quantity</Label>
          <Input
            id="item-qty"
            type="number"
            step="any"
            min="0.000001"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            disabled={!selectedProductId}
            className="bg-input border-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="item-unit">Unit</Label>
          <Select value={unit} onValueChange={setUnit} disabled={!selectedProductId}>
            <SelectTrigger id="item-unit" className="bg-input border-border">
              <SelectValue placeholder="Unit" />
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
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="button"
          onClick={handleAdd}
          disabled={!selectedProductId || !qty || Number(qty) <= 0}
          size="sm"
          className="gap-1.5"
        >
          <Plus className="h-4 w-4" /> Add Compound
        </Button>
      </div>
    </div>
  );
}
