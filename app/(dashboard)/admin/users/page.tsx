"use client";

import { useEffect, useState } from "react";
import { Users, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "@/components/shared/badges";
import { EmptyState } from "@/components/shared/empty-state";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminUsersPage() {
    const [users, setUsers]     = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = () =>
        fetch("/api/users")
            .then((r) => r.json())
            .then((d) => setUsers(d.items ?? []))
            .finally(() => setLoading(false));

    useEffect(() => { fetchUsers(); }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-serif text-2xl font-semibold text-foreground flex items-center gap-2">
                        <Users className="h-6 w-6 text-primary" /> User Management
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">{users.length} registered users</p>
                </div>
            </div>

            {loading ? <TableSkeleton /> : users.length === 0 ? (
                <EmptyState icon={Users} title="No users yet" />
            ) : (
                <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30 hover:bg-muted/30">
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Joined</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id} className="hover:bg-muted/20 transition-colors">
                                    <TableCell className="font-medium text-foreground">{user.name}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                                    <TableCell><RoleBadge role={user.role} /></TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {new Date(user.createdAt).toLocaleDateString("en-IN")}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
