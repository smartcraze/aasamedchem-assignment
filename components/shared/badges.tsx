import { cn } from "@/lib/utils";

type Role = "ADMIN" | "SELLER" | "BUYER";

const ROLE_CONFIG: Record<Role, { label: string; className: string }> = {
    ADMIN:  { label: "Admin",  className: "bg-primary/15 text-primary border-primary/30" },
    SELLER: { label: "Seller", className: "bg-accent/20 text-accent-foreground border-accent/40" },
    BUYER:  { label: "Buyer",  className: "bg-secondary text-secondary-foreground border-border" },
};

export function RoleBadge({ role }: { role: string }) {
    const config = ROLE_CONFIG[role as Role] ?? {
        label: role,
        className: "bg-muted text-muted-foreground border-border",
    };

    return (
        <span className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
            config.className
        )}>
            {config.label}
        </span>
    );
}

type OrderStatus = "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
    PENDING:    { label: "Pending Review", className: "bg-accent/20 text-accent-foreground border-accent/40" },
    APPROVED:   { label: "Approved",       className: "bg-primary/15 text-primary border-primary/30" },
    REJECTED:   { label: "Rejected",       className: "bg-destructive/20 text-foreground border-destructive/30" },
    COMPLETED:  { label: "Completed",      className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
};

export function StatusBadge({ status }: { status: string }) {
    const config = STATUS_CONFIG[status as OrderStatus] ?? {
        label: status,
        className: "bg-muted text-muted-foreground border-border",
    };

    return (
        <span className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
            config.className
        )}>
            {config.label}
        </span>
    );
}
