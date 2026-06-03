const STEPS = [
    {
        number: "01",
        role: "Admin",
        title: "Set up the catalogue",
        desc: "Admins create products with dimension, stock in base units, and price per base unit. Inventory is always canonical — no ambiguity.",
    },
    {
        number: "02",
        role: "Buyer",
        title: "Browse & request a quote",
        desc: "Buyers select products, enter quantities in their preferred unit. The platform converts and previews the total price with full precision before checkout.",
    },
    {
        number: "03",
        role: "Seller",
        title: "Fulfil & track",
        desc: "Sellers review assigned orders, advance status from Confirmed → Processing → Shipped → Delivered. Every state change is recorded.",
    },
];

export function HowItWorksSection() {
    return (
        <section id="how-it-works" className="relative py-24 px-4 bg-secondary/30">
            {/* Subtle ruled top/bottom borders */}
            <div className="absolute inset-x-0 top-0 h-px bg-border" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-border" />

            <div className="mx-auto max-w-7xl">
                <div className="mb-14 text-center">
                    <p className="mb-3 text-xs font-medium uppercase tracking-widest text-primary">
                        Workflow
                    </p>
                    <h2 className="font-serif text-3xl font-semibold text-foreground sm:text-4xl">
                        How it works
                    </h2>
                    <p className="mt-4 mx-auto max-w-md text-base text-muted-foreground">
                        Three roles, one seamless flow — from catalogue creation to final delivery.
                    </p>
                </div>

                <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
                    {/* Connecting line (desktop only) */}
                    <div aria-hidden className="absolute top-8 inset-x-12 h-px bg-border hidden md:block" />

                    {STEPS.map((step) => (
                        <div key={step.number} className="relative flex flex-col items-center text-center px-4">
                            {/* Step number circle */}
                            <div className="relative z-10 mb-5 flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary/40 bg-background shadow-sm">
                                <span className="font-serif text-xl font-semibold text-primary">{step.number}</span>
                            </div>

                            <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary">
                                {step.role}
                            </span>
                            <h3 className="font-serif text-lg font-semibold text-foreground">{step.title}</h3>
                            <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xs">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
