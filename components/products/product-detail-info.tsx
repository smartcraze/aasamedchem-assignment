"use client";

import { FlaskConical, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  name: string;
  sku?: string;
  dimension: string;
  stockBaseQty: string;
  pricePerBaseUnit: string;
  isActive: boolean;
  description?: string;
}

const DIMENSION_LABELS: Record<string, string> = {
  WEIGHT: "Weight (measured in grams/kilograms)",
  VOLUME: "Volume (measured in milliliters/liters)",
  COUNT: "Count (measured in units)",
};

const BASE_UNITS: Record<string, string> = {
  WEIGHT: "g",
  VOLUME: "mL",
  COUNT: "units",
};

export function ProductDetailInfo({ product }: { product: Product }) {
  const baseUnit = BASE_UNITS[product.dimension] ?? "";

  return (
    <div className="space-y-6 rounded-2xl border border-border bg-card p-6 md:p-8 relative overflow-hidden shadow-sm">
      {/* Background dot-grid pattern for science aesthetic */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "20px 20px"
        }} 
      />

      <div className="relative space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FlaskConical className="h-5 w-5" />
          </div>
          <div className="flex gap-2">
            <Badge variant={product.isActive ? "secondary" : "outline"}>
              {product.isActive ? "Active Catalogue" : "Archived"}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {product.dimension.toLowerCase()}
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-3xl font-semibold leading-tight text-foreground">
            {product.name}
          </h2>
          {product.sku && (
            <p className="font-mono text-xs text-muted-foreground">
              SKU: {product.sku}
            </p>
          )}
        </div>

        {product.description ? (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {product.description}
          </p>
        ) : (
          <p className="text-sm italic text-muted-foreground">
            No description provided for this chemical product.
          </p>
        )}

        <hr className="border-border opacity-70" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-muted/20 p-4 border border-border/50">
            <span className="text-xs text-muted-foreground block font-medium">Dimension Category</span>
            <span className="text-sm text-foreground mt-1 block font-serif font-medium">
              {DIMENSION_LABELS[product.dimension] ?? product.dimension}
            </span>
          </div>

          <div className="rounded-xl bg-muted/20 p-4 border border-border/50">
            <span className="text-xs text-muted-foreground block font-medium">Price per Base Unit</span>
            <span className="text-sm font-semibold text-primary mt-1 block">
              ₹{Number(product.pricePerBaseUnit).toFixed(2)} per {baseUnit}
            </span>
          </div>

          <div className="rounded-xl bg-muted/20 p-4 border border-border/50 sm:col-span-2">
            <span className="text-xs text-muted-foreground block font-medium">Current Stock Availability</span>
            <div className="flex items-center gap-2 mt-1.5">
              <Circle className={`h-2.5 w-2.5 fill-current ${
                Number(product.stockBaseQty) > 0 ? "text-emerald-500" : "text-amber-500"
              }`} />
              <span className="text-sm font-medium text-foreground">
                {Number(product.stockBaseQty).toLocaleString()} {baseUnit} in stock
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
