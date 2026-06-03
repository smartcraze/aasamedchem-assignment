"use client";

import Link from "next/link";
import { useSession } from "@/lib/hooks/use-session";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Settings } from "lucide-react";
import type { SessionPayload } from "@/lib/auth";

interface NavUserProps {
    session: SessionPayload | null;
}

export function NavUser({ session }: NavUserProps) {
    const { signOut } = useSession();

    if (!session) {
        return (
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/sign-in">Sign in</Link>
                </Button>
                <Button size="sm" asChild>
                    <Link href="/sign-up">Get started</Link>
                </Button>
            </div>
        );
    }

    const initials = session.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    id="nav-user-menu"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground ring-offset-background transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                    {initials}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 bg-popover text-popover-foreground">
                <DropdownMenuLabel className="font-normal">
                    <p className="text-sm font-medium text-foreground">{session.name}</p>
                    <p className="text-xs text-muted-foreground">{session.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" /> Dashboard
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    id="nav-sign-out"
                    className="cursor-pointer text-destructive-foreground focus:bg-destructive/10 focus:text-foreground"
                    onClick={() => signOut()}
                >
                    <LogOut className="mr-2 h-4 w-4" /> Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
