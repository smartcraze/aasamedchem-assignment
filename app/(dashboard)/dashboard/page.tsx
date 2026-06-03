"use client";

import { useSession } from "@/lib/hooks/use-session";
import { PageSkeleton } from "@/components/shared/loading-skeleton";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { BuyerDashboard } from "@/components/dashboard/buyer-dashboard";
import { SellerDashboard } from "@/components/dashboard/seller-dashboard";

export default function DashboardPage() {
    const { session, status } = useSession();

    if (status === "loading") return <PageSkeleton />;

    if (!session) return null;

    if (session.role === "ADMIN")  return <AdminDashboard  session={session} />;
    if (session.role === "SELLER") return <SellerDashboard session={session} />;
    return <BuyerDashboard session={session} />;
}
