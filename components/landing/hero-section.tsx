import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, FlaskConical } from "lucide-react";

export function HeroSection() {
    return (
        <section className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pt-24 pb-16 text-center">

            {/* Ambient orbs */}
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-32 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary opacity-[0.08] blur-[120px]" />
                <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-accent opacity-[0.06] blur-[100px]" />
                {/* Dot grid */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
                {/* Thin ruled lines */}
                <div className="absolute inset-x-0 top-1/2 h-px bg-border opacity-40" />
                <div className="absolute inset-y-0 left-1/2 w-px bg-border opacity-30" />
            </div>

            {/* Pre-headline badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-4 py-1.5 text-xs font-medium text-primary">
                <FlaskConical className="h-3.5 w-3.5" />
                Precision-grade chemical supply platform
            </div>

            {/* Headline */}
            <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl max-w-3xl">
                Inventory & quotation
                <br />
                <span className="relative inline-block text-primary">
                    engineered for accuracy
                    <span aria-hidden className="absolute -bottom-1 inset-x-0 h-[3px] rounded-full bg-accent opacity-70" />
                </span>
            </h1>

            {/* Sub-headline */}
            <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg leading-relaxed">
                AasaMedChem connects buyers, sellers, and admins in a single precision-safe
                platform — with unit-aware inventory, decimal-correct pricing, and a clean
                quotation workflow.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Button size="lg" asChild className="gap-2 shadow-md">
                    <Link href="/sign-up">
                        Get started free <ArrowRight className="h-4 w-4" />
                    </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                    <Link href="/sign-in">Sign in to platform</Link>
                </Button>
            </div>

            {/* Social proof strip */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-center">
                {[
                    { value: "3 roles",    label: "Admin · Seller · Buyer" },
                    { value: "6 decimal",  label: "Precision pricing" },
                    { value: "Real-time",  label: "Order tracking" },
                ].map((s) => (
                    <div key={s.value} className="space-y-0.5">
                        <p className="font-serif text-xl font-semibold text-foreground">{s.value}</p>
                        <p className="text-xs text-muted-foreground">{s.label}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
