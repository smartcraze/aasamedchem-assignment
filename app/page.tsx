import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LandingNav } from "@/components/landing/landing-nav";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { StatsSection } from "@/components/landing/stats-section";
import { CtaSection } from "@/components/landing/cta-section";
import { LandingFooter } from "@/components/landing/landing-footer";

export const metadata = {
    title: "AasaMedChem — Precision Chemical Inventory & Quotation Platform",
    description:
        "Role-based inventory management, unit-aware ordering, and decimal-precise pricing for the chemical supply chain.",
};

export default async function RootPage() {
    const session = await getSession();
    if (session) redirect("/dashboard");

    return (
        <div className="min-h-screen bg-background text-foreground">
            <LandingNav />
            <HeroSection />
            <FeaturesSection />
            <HowItWorksSection />
            <StatsSection />
            <CtaSection />
            <LandingFooter />
        </div>
    );
}
