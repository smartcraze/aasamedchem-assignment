import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

interface OrderItem {
    id: string;
    product: { name: string };
    orderedQty: number;
    orderedUnit: string;
    baseQty: string;
    unitPrice: string;
    totalPrice: string;
}

export function OrderItemsTable({ items }: { items: OrderItem[] }) {
    return (
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="border-b border-border px-5 py-3 bg-muted/30">
                <h2 className="text-sm font-semibold text-foreground">Line Items</h2>
            </div>
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead>Product</TableHead>
                        <TableHead>Ordered Qty</TableHead>
                        <TableHead>Base Qty</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => (
                        <TableRow key={item.id} className="hover:bg-muted/20">
                            <TableCell className="font-medium text-foreground">
                                {item.product?.name ?? "—"}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                                {Number(item.orderedQty).toLocaleString()} {item.orderedUnit}
                            </TableCell>
                            <TableCell className="font-mono text-xs text-muted-foreground">
                                {Number(item.baseQty).toFixed(3)}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                                ₹{Number(item.unitPrice).toFixed(4)}
                            </TableCell>
                            <TableCell className="text-right font-semibold text-foreground">
                                ₹{Number(item.totalPrice).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
