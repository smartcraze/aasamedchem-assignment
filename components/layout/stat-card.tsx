import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
    label: string;
    value: string | number;
    delta?: string;
    deltaPositive?: boolean;
    icon: LucideIcon;
    className?: string;
}

export function StatCard({ label, value, delta, deltaPositive, icon: Icon, className }: StatCardProps) {
    return (
        <div className={cn(
            "group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md",
            className
        )}>
            {/* subtle dot pattern */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                }}
            />
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                        {label}
                    </p>
                    <p className="font-serif text-2xl font-semibold text-foreground">{value}</p>
                    {delta && (
                        <p className={cn(
                            "text-xs font-medium",
                            deltaPositive ? "text-chart-4" : "text-destructive"
                        )}>
                            {delta}
                        </p>
                    )}
                </div>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                </div>
            </div>
        </div>
    );
}
