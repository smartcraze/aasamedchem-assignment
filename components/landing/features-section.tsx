import {
    FlaskConical, ShieldCheck, Calculator, Users,
    Package, ArrowRightLeft, Lock, Zap,
} from "lucide-react";

const FEATURES = [
    {
        icon: Calculator,
        title: "Decimal-precise pricing",
        desc: "All calculations use PostgreSQL NUMERIC and Prisma Decimal — no float rounding errors, ever. Every rupee accounted for.",
    },
    {
        icon: ArrowRightLeft,
        title: "Smart unit conversion",
        desc: "Order in kg, g, mL, or units. The platform converts to base units automatically so inventory is always in one canonical format.",
    },
    {
        icon: ShieldCheck,
        title: "Role-based access",
        desc: "Admins manage everything. Sellers fulfil orders assigned to them. Buyers browse and place quotations. Each role sees exactly what it needs.",
    },
    {
        icon: Package,
        title: "Live inventory tracking",
        desc: "Stock is always in base units. Admins can adjust inventory in real-time with an audit trail preserved via order history.",
    },
    {
        icon: FlaskConical,
        title: "Chemical product catalogue",
        desc: "Weight, volume, and count dimensions supported. Each product stores pricePerBaseUnit so quoting is always consistent.",
    },
    {
        icon: Zap,
        title: "Instant order preview",
        desc: "Buyers get a live price breakdown before placing an order — quantity × unit price, calculated server-side with full precision.",
    },
];

export function FeaturesSection() {
    return (
        <section id="features" className="relative py-24 px-4">
            <div className="mx-auto max-w-7xl">
                {/* Section header */}
                <div className="mb-14 text-center">
                    <p className="mb-3 text-xs font-medium uppercase tracking-widest text-primary">
                        Built for the supply chain
                    </p>
                    <h2 className="font-serif text-3xl font-semibold text-foreground sm:text-4xl">
                        Everything you need, nothing you don't
                    </h2>
                    <p className="mt-4 mx-auto max-w-lg text-base text-muted-foreground">
                        Engineered from the ground up with precision-safe data types, role-gated
                        API routes, and a workflow that mirrors real chemical supply operations.
                    </p>
                </div>

                {/* Feature grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {FEATURES.map((f) => (
                        <div
                            key={f.title}
                            className="group relative rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                        >
                            {/* Accent corner */}
                            <div className="absolute right-0 top-0 h-16 w-16 overflow-hidden rounded-2xl pointer-events-none">
                                <div className="absolute right-0 top-0 h-8 w-8 origin-top-right rotate-45 translate-x-4 -translate-y-4 bg-primary/10" />
                            </div>

                            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                                <f.icon className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="font-serif text-base font-semibold text-foreground">
                                {f.title}
                            </h3>
                            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                                {f.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
