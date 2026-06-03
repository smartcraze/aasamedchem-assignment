"use client";

import Link from "next/link";
import { FlaskConical } from "lucide-react";

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

const DIMENSION_UNIT: Record<string, string> = {
  WEIGHT: "g",
  VOLUME: "mL",
  COUNT: "units",
};

export function ProductCard({ product }: { product: Product }) {
  const unit = DIMENSION_UNIT[product.dimension] ?? product.dimension;

  return (
    <div className="group relative flex flex-col justify-between border border-border bg-card p-6 transition-all duration-300 hover:shadow-lg hover:border-foreground/30 rounded-none">
      
      {/* Editorial top layout: category + status */}
      <div className="flex items-center justify-between gap-4 text-[10px] tracking-widest uppercase font-mono text-muted-foreground">
        <span>{product.dimension} // SEGMENT</span>
        <div className="flex items-center gap-1.5">
          <span className={`h-1 w-1 rounded-full ${product.isActive ? "bg-primary" : "bg-muted-foreground"}`} />
          <span>{product.isActive ? "In Stock" : "Archived"}</span>
        </div>
      </div>

      {/* Main product identifiers */}
      <div className="mt-6 space-y-3">
        <div className="space-y-1">
          <h3 className="font-serif text-xl font-normal text-foreground leading-snug tracking-tight group-hover:text-primary transition-colors duration-200">
            {product.name}
          </h3>
          {product.sku && (
            <p className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
              Archival ID: {product.sku}
            </p>
          )}
        </div>

        {/* Separator rule line (editorial print design) */}
        <div className="h-px w-10 bg-foreground/20 transition-all duration-300 group-hover:w-20" />

        {/* Italic editorial description */}
        {product.description ? (
          <p className="font-serif italic text-xs text-muted-foreground/90 leading-relaxed line-clamp-2 h-10">
            {product.description}
          </p>
        ) : (
          <p className="font-serif italic text-xs text-muted-foreground/50 leading-relaxed h-10">
            No specifications provided in the catalog.
          </p>
        )}
      </div>

      {/* Structured specifications layout with thin dividing lines */}
      <div className="mt-8 grid grid-cols-2 gap-4 border-t border-b border-border/80 py-4 text-xs">
        <div className="space-y-1 border-r border-border/60 pr-2">
          <span className="font-serif text-[10px] italic text-muted-foreground block">
            Available Quantity
          </span>
          <span className="font-serif text-sm text-foreground block">
            {Number(product.stockBaseQty).toLocaleString()} {unit}
          </span>
        </div>

        <div className="space-y-1 pl-2">
          <span className="font-serif text-[10px] italic text-muted-foreground block">
            Base Valuation
          </span>
          <span className="font-serif text-sm font-semibold text-primary block">
            ₹{Number(product.pricePerBaseUnit).toLocaleString("en-IN", { minimumFractionDigits: 2 })} <span className="text-[10px] font-normal text-muted-foreground">/{unit}</span>
          </span>
        </div>
      </div>

      {/* Bottom text link with elegant layout */}
      <div className="mt-6">
        <Link 
          href={`/products/${product.id}`}
          className="flex items-center justify-between text-xs uppercase tracking-wider font-semibold text-foreground group-hover:text-primary transition-colors duration-200 focus-visible:outline-none"
        >
          <span className="flex items-center gap-2">
            <FlaskConical className="h-3.5 w-3.5" /> Details & Specs
          </span>
          <span className="font-serif italic capitalize text-sm text-primary group-hover:underline">
            Request quote &rarr;
          </span>
        </Link>
      </div>

    </div>
  );
}
