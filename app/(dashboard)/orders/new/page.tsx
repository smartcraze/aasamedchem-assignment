"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/hooks/use-session";
import { CreateOrderItemForm } from "@/components/orders/create-order-item-form";
import { CreateOrderSummary } from "@/components/orders/create-order-summary";
import { PageSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingBag, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  dimension: string;
  pricePerBaseUnit: string;
  isActive: boolean;
}

interface OrderItem {
  productId: string;
  name: string;
  qty: number;
  unit: string;
}

export default function NewOrderPage() {
  const router = useRouter();
  const { session, status } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetch("/api/products?isActive=true")
      .then((r) => r.json())
      .then((d) => setProducts(d.items ?? []))
      .finally(() => setLoading(false));
  }, []);

  if (status === "loading" || loading) {
    return <PageSkeleton />;
  }

  if (session?.role !== "BUYER") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
        <ShieldAlert className="h-12 w-12 text-destructive" />
        <h2 className="font-serif text-xl font-semibold text-foreground">Access Restricted</h2>
        <p className="text-sm text-muted-foreground">
          Quotation and ordering workflows are only available to Buyer accounts.
        </p>
        <Button onClick={() => router.push("/dashboard")} variant="outline" size="sm" className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Go to Dashboard
        </Button>
      </div>
    );
  }

  const handleAddItem = (newItem: OrderItem) => {
    // Check if item already exists and merge quantity
    const existingIdx = items.findIndex((it) => it.productId === newItem.productId && it.unit === newItem.unit);
    if (existingIdx > -1) {
      const updated = [...items];
      updated[existingIdx].qty += newItem.qty;
      setItems(updated);
      toast.success("Updated quantity for " + newItem.name);
    } else {
      setItems([...items, newItem]);
      toast.success("Added " + newItem.name + " to request list");
    }
  };

  const handleRemoveItem = (index: number) => {
    const updated = [...items];
    const removedName = updated[index].name;
    updated.splice(index, 1);
    setItems(updated);
    toast.info("Removed " + removedName);
  };

  const handleSubmit = () => {
    if (items.length === 0) return;

    startTransition(async () => {
      try {
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((it) => ({
              productId: it.productId,
              orderedQty: it.qty,
              orderedUnit: it.unit,
            })),
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to submit quotation");
        }

        const data = await response.json();
        toast.success("Quotation submitted successfully!");
        router.push(`/orders/${data.id}`);
        router.refresh();
      } catch (err: any) {
        toast.error(err.message || "An unexpected error occurred");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/orders")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="font-serif text-2xl font-semibold text-foreground flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-primary" /> Request New Quotation
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Add multiple compounds to request a single consolidated quote.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-4">
          <CreateOrderItemForm products={products} onAdd={handleAddItem} />
        </div>

        <div className="lg:col-span-1">
          <CreateOrderSummary
            items={items}
            onRemove={handleRemoveItem}
            onSubmit={handleSubmit}
            isSubmitting={isPending}
          />
        </div>
      </div>
    </div>
  );
}
