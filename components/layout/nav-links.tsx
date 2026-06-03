"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Package, ShoppingBag, Users, ShieldCheck } from "lucide-react";

interface NavItem {
    href: string;
    label: string;
    icon: React.ReactNode;
    roles: string[];
}

const NAV_ITEMS: NavItem[] = [
    { href: "/dashboard",       label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" />, roles: ["ADMIN", "SELLER", "BUYER"] },
    { href: "/products",        label: "Products",  icon: <Package          className="h-4 w-4" />, roles: ["ADMIN", "SELLER", "BUYER"] },
    { href: "/orders",          label: "Orders",    icon: <ShoppingBag      className="h-4 w-4" />, roles: ["ADMIN", "SELLER", "BUYER"] },
    { href: "/admin",           label: "Admin",     icon: <ShieldCheck      className="h-4 w-4" />, roles: ["ADMIN"] },
    { href: "/admin/users",     label: "Users",     icon: <Users            className="h-4 w-4" />, roles: ["ADMIN"] },
];

interface NavLinksProps {
    role: string;
    pathname: string;
}

export function NavLinks({ role, pathname }: NavLinksProps) {
    const visible = NAV_ITEMS.filter((item) => item.roles.includes(role));

    return (
        <nav className="hidden items-center gap-1 md:flex">
            {visible.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-150",
                            active
                                ? "bg-secondary text-foreground"
                                : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                        )}
                    >
                        {item.icon}
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
}
