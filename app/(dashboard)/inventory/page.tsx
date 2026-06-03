"use client";

import { useEffect, useState } from "react";
import { Package, Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ProductFilters } from "@/components/products/product-filters";
import { InventoryAdjustDialog } from "@/components/products/inventory-adjust-dialog";

const UNIT: Record<string, string> = { WEIGHT: "g", VOLUME: "mL", COUNT: "units" };

export default function InventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [open, setOpen]         = useState(false);
  const [editing, setEditing]   = useState<any>(null);
  const [q, setQ]               = useState("");
  const [dimension, setDim]     = useState("ALL");

  const fetchProducts = () => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (dimension !== "ALL") params.set("dimension", dimension);

    fetch(`/api/products?${params}`)
      .then((r) => r.json())
      .then((d) => setProducts(d.items ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, [q, dimension]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-foreground flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" /> Inventory Ledger
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View catalog stock levels and perform base unit adjustments.
        </p>
      </div>

      <ProductFilters
        onSearch={(v) => { setLoading(true); setQ(v); }}
        onDimension={(v) => { setLoading(true); setDim(v); }}
      />

      {loading ? (
        <TableSkeleton />
      ) : products.length === 0 ? (
        <EmptyState icon={Package} title="No inventory products found" description="Try adjusting your filters." />
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Compound</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Base Stock</TableHead>
                <TableHead>Base Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id} className="hover:bg-muted/10 transition-colors">
                  <TableCell className="font-serif font-medium text-foreground">{p.name}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{p.sku ?? "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground capitalize">{p.dimension.toLowerCase()}</TableCell>
                  <TableCell className="text-sm font-medium font-mono text-foreground">
                    {Number(p.stockBaseQty).toLocaleString()} {UNIT[p.dimension]}
                  </TableCell>
                  <TableCell className="text-sm font-semibold text-primary font-mono">
                    ₹{Number(p.pricePerBaseUnit).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={p.isActive ? "secondary" : "outline"} className="text-xs">
                      {p.isActive ? "Active" : "Archived"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditing(p);
                        setOpen(true);
                      }}
                      className="gap-1 h-8 text-xs"
                    >
                      <Sliders className="h-3.5 w-3.5 text-primary" /> Adjust Stock
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <InventoryAdjustDialog
        open={open}
        onOpenChange={setOpen}
        product={editing}
        onSaved={() => {
          setOpen(false);
          fetchProducts();
        }}
      />
    </div>
  );
}
