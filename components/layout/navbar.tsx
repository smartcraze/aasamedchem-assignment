"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/hooks/use-session";
import { NavBrand } from "./nav-brand";
import { NavLinks } from "./nav-links";
import { NavUser } from "./nav-user";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export default function Navbar() {
    const pathname = usePathname();
    const { session, status } = useSession();

    if (status === "loading") return <NavSkeleton />;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
                <div className="flex items-center gap-8">
                    <NavBrand />
                    {session && <NavLinks role={session.role} pathname={pathname} />}
                </div>
                <div className="flex items-center gap-1">
                    <ThemeToggle />
                    <NavUser session={session} />
                </div>
            </div>
        </header>
    );
}

function NavSkeleton() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
                <div className="h-5 w-36 animate-pulse rounded bg-muted" />
                <div className="flex items-center gap-3">
                    <div className="h-8 w-24 animate-pulse rounded-lg bg-muted" />
                    <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
                </div>
            </div>
        </header>
    );
}
