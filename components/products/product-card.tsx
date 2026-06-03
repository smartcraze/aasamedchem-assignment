"use client";

import Link from "next/link";
import { FlaskConical, Droplet, Layers, HelpCircle, ArrowRight } from "lucide-react";

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

const DIMENSION_ICON: Record<string, any> = {
  WEIGHT: Layers,
  VOLUME: Droplet,
  COUNT: FlaskConical,
};

export function ProductCard({ product }: { product: Product }) {
  const unit = DIMENSION_UNIT[product.dimension] ?? product.dimension;
  const SegmentIcon = DIMENSION_ICON[product.dimension] ?? HelpCircle;

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/30">
      
      {/* Top Meta Details (Category & Status) */}
      <div className="flex items-center justify-between gap-4">
        <span className="inline-flex items-center gap-1 text-[10px] tracking-wider uppercase font-mono text-muted-foreground/85 bg-muted/60 px-2 py-0.5 rounded-md border border-border/40">
          <SegmentIcon className="h-3 w-3 text-primary/80" />
          {product.dimension}
        </span>
        <div className="flex items-center gap-1.5 text-[10px] tracking-wide font-mono uppercase text-muted-foreground">
          <span className="relative flex h-2 w-2">
            {product.isActive && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${product.isActive ? "bg-emerald-500" : "bg-muted-foreground/60"}`}></span>
          </span>
          <span>{product.isActive ? "In Stock" : "Archived"}</span>
        </div>
      </div>

      {/* Main product info */}
      <div className="mt-5 space-y-3">
        <div className="space-y-1">
          <h3 className="font-serif text-xl font-normal text-foreground leading-snug tracking-tight group-hover:text-primary transition-colors duration-200">
            {product.name}
          </h3>
          {product.sku && (
            <p className="inline-block font-mono text-[9px] tracking-wider text-muted-foreground uppercase bg-muted/40 border border-border/30 px-1.5 py-0.5 rounded">
              REF: {product.sku}
            </p>
          )}
        </div>

        {/* Dynamic rule decoration */}
        <div className="h-[2px] w-8 bg-primary/20 transition-all duration-300 group-hover:w-16 group-hover:bg-primary/45" />

        {/* Chemical/product description */}
        {product.description ? (
          <p className="font-sans text-xs text-muted-foreground/90 leading-relaxed line-clamp-2 h-10">
            {product.description}
          </p>
        ) : (
          <p className="font-sans italic text-xs text-muted-foreground/45 leading-relaxed h-10">
            No specifications provided in the catalog.
          </p>
        )}
      </div>

      {/* Specification breakdown panel */}
      <div className="mt-6 grid grid-cols-2 gap-3 rounded-xl border border-border/40 bg-muted/30 p-3 hover:bg-muted/50 transition-colors duration-200 text-xs">
        <div className="space-y-0.5 border-r border-border/60 pr-1">
          <span className="font-sans text-[10px] text-muted-foreground/80 block">
            Available Quantity
          </span>
          <span className="font-serif text-sm font-medium text-foreground block">
            {Number(product.stockBaseQty).toLocaleString()} {unit}
          </span>
        </div>

        <div className="space-y-0.5 pl-2">
          <span className="font-sans text-[10px] text-muted-foreground/80 block">
            Base Valuation
          </span>
          <span className="font-serif text-sm font-semibold text-primary block">
            ₹{Number(product.pricePerBaseUnit).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            <span className="text-[10px] font-sans font-normal text-muted-foreground/80">/{unit}</span>
          </span>
        </div>
      </div>

      {/* Footer Controls: Details link and styled Request Quote button */}
      <div className="mt-6 flex items-center justify-between border-t border-border/20 pt-4">
        <Link 
          href={`/products/${product.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <FlaskConical className="h-3.5 w-3.5" /> Details & Specs
        </Link>

        <Link 
          href={`/products/${product.id}`}
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
        >
          Request Quote
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

    </div>
  );
}
