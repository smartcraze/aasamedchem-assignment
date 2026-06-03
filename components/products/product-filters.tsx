"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";

interface ProductFiltersProps {
    onSearch: (q: string) => void;
    onDimension: (d: string) => void;
}

export function ProductFilters({ onSearch, onDimension }: ProductFiltersProps) {
    const [q, setQ] = useState("");

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    id="product-search"
                    placeholder="Search products…"
                    value={q}
                    onChange={(e) => { setQ(e.target.value); onSearch(e.target.value); }}
                    className="pl-9 bg-input border-border placeholder:text-muted-foreground"
                />
            </div>
            <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground shrink-0" />
                <Select onValueChange={onDimension} defaultValue="ALL">
                    <SelectTrigger id="product-dimension-filter" className="w-36 bg-input border-border">
                        <SelectValue placeholder="Dimension" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All types</SelectItem>
                        <SelectItem value="WEIGHT">Weight (g)</SelectItem>
                        <SelectItem value="VOLUME">Volume (mL)</SelectItem>
                        <SelectItem value="COUNT">Count</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
