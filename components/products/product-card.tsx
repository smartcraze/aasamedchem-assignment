"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FlaskConical, ArrowRight } from "lucide-react";

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
    COUNT:  "units",
};

export function ProductCard({ product }: { product: Product }) {
    const unit = DIMENSION_UNIT[product.dimension] ?? product.dimension;

    return (
        <Card className="group flex flex-col overflow-hidden border-border bg-card transition-shadow hover:shadow-md">
            {/* Top accent bar */}
            <div className="h-1 w-full bg-primary opacity-60 group-hover:opacity-100 transition-opacity" />

            <CardContent className="flex-1 p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <FlaskConical className="h-4 w-4 text-primary" />
                    </div>
                    <Badge
                        variant={product.isActive ? "secondary" : "outline"}
                        className="text-xs"
                    >
                        {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                </div>

                <div>
                    <h3 className="font-serif font-semibold text-foreground leading-snug line-clamp-2">
                        {product.name}
                    </h3>
                    {product.sku && (
                        <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                            SKU: {product.sku}
                        </p>
                    )}
                    {product.description && (
                        <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">
                            {product.description}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                        <p className="text-xs text-muted-foreground">Stock</p>
                        <p className="text-sm font-medium text-foreground">
                            {Number(product.stockBaseQty).toLocaleString()} {unit}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Price / {unit}</p>
                        <p className="text-sm font-semibold text-primary">
                            ₹{Number(product.pricePerBaseUnit).toFixed(2)}
                        </p>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="border-t border-border bg-muted/20 px-5 py-3">
                <Button variant="ghost" size="sm" className="ml-auto gap-1 text-xs" asChild>
                    <Link href={`/products/${product.id}`}>
                        View details <ArrowRight className="h-3 w-3" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
