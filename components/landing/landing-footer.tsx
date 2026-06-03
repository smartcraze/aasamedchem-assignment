import Link from "next/link";
import { FlaskConical } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function LandingFooter() {
    return (
        <footer className="border-t border-border bg-muted/20 px-4 py-12">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
                    {/* Brand */}
                    <div className="flex items-center gap-2.5 font-serif text-base font-semibold text-foreground">
                        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                            <FlaskConical className="h-3.5 w-3.5" />
                        </span>
                        AasaMedChem
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <Link href="/sign-in"  className="hover:text-foreground transition-colors">Sign in</Link>
                        <Link href="/sign-up"  className="hover:text-foreground transition-colors">Register</Link>
                        <Link href="/products" className="hover:text-foreground transition-colors">Products</Link>
                    </div>
                </div>

                <Separator className="my-8" />

                <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} AasaMedChem. All rights reserved.
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Precision-safe · Role-gated · Decimal-correct
                    </p>
                </div>
            </div>
        </footer>
    );
}
