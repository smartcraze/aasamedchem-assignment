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

type OrderStatus = "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
    PENDING:    { label: "Pending",    className: "bg-accent/20 text-accent-foreground border-accent/40" },
    CONFIRMED:  { label: "Confirmed",  className: "bg-secondary text-secondary-foreground border-border" },
    PROCESSING: { label: "Processing", className: "bg-primary/15 text-primary border-primary/30" },
    SHIPPED:    { label: "Shipped",    className: "bg-chart-3/20 text-chart-3 border-chart-3/30" },
    DELIVERED:  { label: "Delivered",  className: "bg-chart-4/20 text-chart-4 border-chart-4/30" },
    CANCELLED:  { label: "Cancelled",  className: "bg-destructive/20 text-foreground border-destructive/30" },
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
