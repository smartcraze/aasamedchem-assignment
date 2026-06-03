import type { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        template: "%s | AasaMedChem",
        default: "AasaMedChem",
    },
    description: "Inventory and quotation management platform for AasaMedChem.",
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left decorative panel — hidden on mobile */}
            <div className="hidden lg:flex flex-col justify-between bg-primary p-10 relative overflow-hidden">
                {/* Subtle radial glow */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        background:
                            "radial-gradient(ellipse 80% 60% at 50% 40%, var(--accent), transparent)",
                    }}
                />

                {/* Logo / Brand */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 flex items-center justify-center">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="w-5 h-5 text-primary-foreground"
                        >
                            <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
                        </svg>
                    </div>
                    <span className="text-primary-foreground font-semibold text-lg tracking-tight">
                        AasaMedChem
                    </span>
                </div>

                {/* Headline */}
                <div className="relative z-10 space-y-4">
                    <blockquote className="space-y-3">
                        <p className="text-primary-foreground text-2xl font-medium leading-snug">
                            "Precision-grade inventory management for the modern chemical supply chain."
                        </p>
                        <footer className="text-primary-foreground/60 text-sm">
                            — AasaMedChem Platform
                        </footer>
                    </blockquote>

                    <div className="flex gap-6 pt-4">
                        <div>
                            <p className="text-primary-foreground text-xl font-semibold">500+</p>
                            <p className="text-primary-foreground/60 text-xs mt-0.5">Products tracked</p>
                        </div>
                        <div className="w-px bg-primary-foreground/20" />
                        <div>
                            <p className="text-primary-foreground text-xl font-semibold">99.9%</p>
                            <p className="text-primary-foreground/60 text-xs mt-0.5">Calculation accuracy</p>
                        </div>
                        <div className="w-px bg-primary-foreground/20" />
                        <div>
                            <p className="text-primary-foreground text-xl font-semibold">3 roles</p>
                            <p className="text-primary-foreground/60 text-xs mt-0.5">Admin · Seller · Buyer</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right — form area */}
            <div className="flex items-center justify-center p-6 sm:p-10 bg-background">
                <div className="w-full max-w-sm">
                    {/* Mobile brand mark */}
                    <div className="flex items-center gap-2 mb-8 lg:hidden">
                        <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="w-4 h-4 text-primary-foreground"
                            >
                                <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
                            </svg>
                        </div>
                        <span className="font-semibold text-foreground">AasaMedChem</span>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}
