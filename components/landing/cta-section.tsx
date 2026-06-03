import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
    return (
        <section className="relative py-24 px-4 overflow-hidden">
            {/* Background glow */}
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute inset-x-0 top-0 h-px bg-border" />
                <div className="absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary opacity-[0.06] blur-[120px]" />
            </div>

            <div className="mx-auto max-w-2xl text-center">
                <p className="mb-4 text-xs font-medium uppercase tracking-widest text-primary">
                    Ready to start?
                </p>
                <h2 className="font-serif text-3xl font-semibold text-foreground sm:text-4xl leading-tight">
                    The supply chain deserves
                    <br />
                    better software.
                </h2>
                <p className="mt-5 text-base text-muted-foreground max-w-md mx-auto">
                    Create your account and start managing chemical inventory with
                    the accuracy and clarity your business demands.
                </p>
                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                    <Button size="lg" asChild className="gap-2 shadow-md">
                        <Link href="/sign-up">
                            Create free account <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                        <Link href="/sign-in">Sign in</Link>
                    </Button>
                </div>
                <p className="mt-6 text-xs text-muted-foreground">
                    No credit card required · Roles: Admin, Seller, Buyer
                </p>
            </div>
        </section>
    );
}
