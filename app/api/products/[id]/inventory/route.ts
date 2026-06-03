import { NextRequest, NextResponse } from "next/server";
import { ProductInventorySchema } from "@/types/products";
import { updateInventory } from "@/lib/repository/products";
import requireAdmin from "@/lib/required-admin";

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const adminCheck = await requireAdmin(request);
    if (adminCheck) return adminCheck;

    const body = await request.json();
    const parsed = ProductInventorySchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const product = await updateInventory(params.id, parsed.data.stockBaseQty);
    return NextResponse.json(product);
}
