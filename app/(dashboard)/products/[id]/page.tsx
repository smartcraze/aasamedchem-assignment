"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/hooks/use-session";
import { ProductDetailInfo } from "@/components/products/product-detail-info";
import { ProductOrderCard } from "@/components/products/product-order-card";
import { PageSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { session, status } = useSession();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Product not found");
        return r.json();
      })
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (status === "loading" || loading) {
    return <PageSkeleton />;
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
        <ShieldAlert className="h-12 w-12 text-destructive" />
        <h2 className="font-serif text-xl font-semibold text-foreground">Product Not Found</h2>
        <p className="text-sm text-muted-foreground">
          The chemical product you are looking for does not exist or has been removed.
        </p>
        <Button onClick={() => router.push("/products")} variant="outline" size="sm" className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Return to Catalogue
        </Button>
      </div>
    );
  }

  const isBuyer = session?.role === "BUYER";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/products")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="font-serif text-xl font-semibold text-foreground">Product Details</h1>
          <p className="text-xs text-muted-foreground">Chemical characteristics and ordering status</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Product specifications */}
        <div className="lg:col-span-2">
          <ProductDetailInfo product={product} />
        </div>

        {/* Right Column: Dynamic ordering card */}
        <div className="lg:col-span-1">
          {isBuyer ? (
            <ProductOrderCard product={product} />
          ) : (
            <div className="rounded-2xl border border-border bg-card p-6 text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                You are logged in as an <span className="font-semibold text-foreground">{session?.role}</span>.
              </p>
              <p className="text-xs text-muted-foreground">
                Quotation requests can only be placed by Buyer accounts.
              </p>
              {session?.role === "ADMIN" && (
                <Button size="sm" variant="outline" asChild className="w-full">
                  <Link href="/admin/products">Manage Product Catalogue</Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
