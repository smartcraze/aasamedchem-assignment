const STATS = [
    { value: "6",       unit: "decimal places", label: "Pricing precision via PostgreSQL NUMERIC" },
    { value: "3",       unit: "user roles",      label: "Admin, Seller, Buyer — each with scoped access" },
    { value: "100%",    unit: "base units",      label: "All inventory stored in canonical base units" },
    { value: "0",       unit: "float math",      label: "Decimal.js throughout — no rounding surprises" },
];

export function StatsSection() {
    return (
        <section id="stats" className="py-24 px-4">
            <div className="mx-auto max-w-7xl">
                <div className="mb-14 text-center">
                    <p className="mb-3 text-xs font-medium uppercase tracking-widest text-primary">
                        By the numbers
                    </p>
                    <h2 className="font-serif text-3xl font-semibold text-foreground sm:text-4xl">
                        Precision isn't optional
                    </h2>
                    <p className="mt-4 mx-auto max-w-md text-base text-muted-foreground">
                        Every design decision in AasaMedChem is driven by correctness first, speed second.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-px rounded-2xl border border-border overflow-hidden bg-border lg:grid-cols-4">
                    {STATS.map((s) => (
                        <div
                            key={s.value}
                            className="group flex flex-col items-center justify-center bg-card px-6 py-10 text-center transition-colors hover:bg-secondary/50"
                        >
                            <div className="flex items-baseline gap-1.5">
                                <span className="font-serif text-4xl font-bold text-foreground">{s.value}</span>
                                <span className="text-sm font-medium text-primary">{s.unit}</span>
                            </div>
                            <p className="mt-3 text-xs text-muted-foreground leading-snug max-w-[160px]">
                                {s.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
