"use client";

import { useEffect, useState } from "react";
import { Package, Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminProductDialog } from "@/components/admin/admin-product-dialog";

const UNIT: Record<string, string> = { WEIGHT: "g", VOLUME: "mL", COUNT: "units" };

export default function AdminProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading]   = useState(true);
    const [open, setOpen]         = useState(false);
    const [editing, setEditing]   = useState<any>(null);

    const fetchProducts = () =>
        fetch("/api/products")
            .then((r) => r.json())
            .then((d) => setProducts(Array.isArray(d) ? d : []))
            .finally(() => setLoading(false));

    useEffect(() => { fetchProducts(); }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-serif text-2xl font-semibold text-foreground flex items-center gap-2">
                        <Package className="h-6 w-6 text-primary" /> Products
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">{products.length} products in catalogue</p>
                </div>
                <Button size="sm" onClick={() => { setEditing(null); setOpen(true); }}>
                    <Plus className="mr-1.5 h-4 w-4" /> Add Product
                </Button>
            </div>

            {loading ? <TableSkeleton /> : products.length === 0 ? (
                <EmptyState icon={Package} title="No products yet" action={
                    <Button size="sm" onClick={() => setOpen(true)}>Add first product</Button>
                } />
            ) : (
                <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30 hover:bg-muted/30">
                                <TableHead>Name</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead>Dimension</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead>Price / unit</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((p) => (
                                <TableRow key={p.id} className="hover:bg-muted/20 transition-colors">
                                    <TableCell className="font-medium text-foreground">{p.name}</TableCell>
                                    <TableCell className="font-mono text-xs text-muted-foreground">{p.sku ?? "—"}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground capitalize">{p.dimension.toLowerCase()}</TableCell>
                                    <TableCell className="text-sm text-foreground">{Number(p.stockBaseQty).toLocaleString()} {UNIT[p.dimension]}</TableCell>
                                    <TableCell className="text-sm font-semibold text-primary">₹{Number(p.pricePerBaseUnit).toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Badge variant={p.isActive ? "secondary" : "outline"} className="text-xs">
                                            {p.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" className="h-7 w-7"
                                            onClick={() => { setEditing(p); setOpen(true); }}>
                                            <Pencil className="h-3.5 w-3.5" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            <AdminProductDialog
                open={open}
                onOpenChange={setOpen}
                product={editing}
                onSaved={() => { setOpen(false); fetchProducts(); }}
            />
        </div>
    );
}
