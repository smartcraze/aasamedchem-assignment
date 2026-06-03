"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface AdminProductDialogProps {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    product: any | null;
    onSaved: () => void;
}

export function AdminProductDialog({ open, onOpenChange, product, onSaved }: AdminProductDialogProps) {
    const [isPending, start] = useTransition();
    const [form, setForm] = useState({
        name: "", sku: "", description: "", dimension: "WEIGHT",
        stockBaseQty: "", pricePerBaseUnit: "",
    });

    useEffect(() => {
        if (product) {
            setForm({
                name: product.name ?? "",
                sku: product.sku ?? "",
                description: product.description ?? "",
                dimension: product.dimension ?? "WEIGHT",
                stockBaseQty: String(product.stockBaseQty ?? ""),
                pricePerBaseUnit: String(product.pricePerBaseUnit ?? ""),
            });
        } else {
            setForm({ name: "", sku: "", description: "", dimension: "WEIGHT", stockBaseQty: "", pricePerBaseUnit: "" });
        }
    }, [product, open]);

    const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        start(async () => {
            const url    = product ? `/api/products/${product.id}` : "/api/products";
            const method = product ? "PATCH" : "POST";
            const toastId = toast.loading(product ? "Updating…" : "Creating…");

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    stockBaseQty: Number(form.stockBaseQty),
                    pricePerBaseUnit: Number(form.pricePerBaseUnit),
                }),
            });

            if (res.ok) {
                toast.success(product ? "Product updated." : "Product created.", { id: toastId });
                onSaved();
            } else {
                const data = await res.json().catch(() => ({}));
                toast.error("Failed.", { id: toastId, description: data?.error ?? "Try again." });
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-card border-border sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-serif">{product ? "Edit Product" : "New Product"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2 space-y-1.5">
                            <Label htmlFor="prod-name">Product name *</Label>
                            <Input id="prod-name" value={form.name} onChange={(e) => set("name", e.target.value)} required className="bg-input border-border" />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="prod-sku">SKU</Label>
                            <Input id="prod-sku" value={form.sku} onChange={(e) => set("sku", e.target.value)} className="bg-input border-border" />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Dimension *</Label>
                            <Select value={form.dimension} onValueChange={(v) => set("dimension", v)}>
                                <SelectTrigger className="bg-input border-border"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="WEIGHT">Weight (g)</SelectItem>
                                    <SelectItem value="VOLUME">Volume (mL)</SelectItem>
                                    <SelectItem value="COUNT">Count (units)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="prod-stock">Stock (base unit) *</Label>
                            <Input id="prod-stock" type="number" step="any" value={form.stockBaseQty} onChange={(e) => set("stockBaseQty", e.target.value)} required className="bg-input border-border" />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="prod-price">Price / base unit (₹) *</Label>
                            <Input id="prod-price" type="number" step="any" value={form.pricePerBaseUnit} onChange={(e) => set("pricePerBaseUnit", e.target.value)} required className="bg-input border-border" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {product ? "Save changes" : "Create"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
