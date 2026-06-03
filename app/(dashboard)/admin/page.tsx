import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") redirect("/dashboard");

    return <AdminDashboard session={session} />;
}
