"use client";

import { useEffect, useState } from "react";
import { Package } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { ProductFilters } from "@/components/products/product-filters";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/shared/loading-skeleton";

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading]   = useState(true);
    const [q, setQ]               = useState("");
    const [dimension, setDim]     = useState("ALL");

    useEffect(() => {
        const params = new URLSearchParams();
        if (q)               params.set("q", q);
        if (dimension !== "ALL") params.set("dimension", dimension);

        fetch(`/api/products?${params}`)
            .then((r) => r.json())
            .then((d) => setProducts(Array.isArray(d) ? d : []))
            .finally(() => setLoading(false));
    }, [q, dimension]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-serif text-2xl font-semibold text-foreground flex items-center gap-2">
                    <Package className="h-6 w-6 text-primary" /> Product Catalogue
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Browse available chemical products.
                </p>
            </div>

            <ProductFilters
                onSearch={(v) => { setLoading(true); setQ(v); }}
                onDimension={(v) => { setLoading(true); setDim(v); }}
            />

            {loading ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-52 rounded-xl" />
                    ))}
                </div>
            ) : products.length === 0 ? (
                <EmptyState
                    icon={Package}
                    title="No products found"
                    description="Try adjusting your search or filter."
                />
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
            )}
        </div>
    );
}
