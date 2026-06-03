"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FlaskConical, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/hooks/use-session";

const NAV_LINKS = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How it works" },
    { href: "#stats", label: "Platform" },
];

export function LandingNav() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const { status } = useSession();

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 12);
        window.addEventListener("scroll", handler, { passive: true });
        return () => window.removeEventListener("scroll", handler);
    }, []);

    return (
        <header className={cn(
            "fixed inset-x-0 top-0 z-50 transition-all duration-300",
            scrolled
                ? "border-b border-border bg-background/90 backdrop-blur-md shadow-sm"
                : "bg-transparent"
        )}>
            <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
                {/* Brand */}
                <Link href="/" className="flex items-center gap-2.5 font-serif text-lg font-semibold text-foreground">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                        <FlaskConical className="h-4 w-4" />
                    </span>
                    AasaMedChem
                </Link>

                {/* Desktop links */}
                <div className="hidden items-center gap-6 md:flex">
                    {NAV_LINKS.map((l) => (
                        <a key={l.href} href={l.href}
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                            {l.label}
                        </a>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    {status === "authenticated" ? (
                        <Button size="sm" asChild className="hidden sm:flex">
                            <Link href="/dashboard">Dashboard</Link>
                        </Button>
                    ) : (
                        <>
                            <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
                                <Link href="/sign-in">Sign in</Link>
                            </Button>
                            <Button size="sm" asChild className="hidden sm:flex">
                                <Link href="/sign-up">Get started</Link>
                            </Button>
                        </>
                    )}
                    <button className="md:hidden p-1.5 text-muted-foreground hover:text-foreground"
                        onClick={() => setOpen(!open)} aria-label="Toggle menu">
                        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </nav>

            {/* Mobile menu */}
            {open && (
                <div className="border-t border-border bg-background/95 backdrop-blur-md md:hidden px-4 py-4 space-y-1">
                    {NAV_LINKS.map((l) => (
                        <a key={l.href} href={l.href} onClick={() => setOpen(false)}
                            className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                            {l.label}
                        </a>
                    ))}
                    <div className="flex gap-2 pt-3 border-t border-border">
                        {status === "authenticated" ? (
                            <Button size="sm" className="flex-1" asChild>
                                <Link href="/dashboard">Dashboard</Link>
                            </Button>
                        ) : (
                            <>
                                <Button variant="outline" size="sm" className="flex-1" asChild>
                                    <Link href="/sign-in">Sign in</Link>
                                </Button>
                                <Button size="sm" className="flex-1" asChild>
                                    <Link href="/sign-up">Get started</Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
