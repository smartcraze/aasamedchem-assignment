import { NextRequest, NextResponse } from "next/server";
import { ProductInventorySchema } from "@/types/products";
import { updateInventory } from "@/lib/repository/products";
import requireAdmin from "@/lib/required-admin";
import { revalidateTag } from "next/cache";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const adminCheck = await requireAdmin();
    if (adminCheck) return adminCheck;

    const { id } = await params;
    const body = await request.json();
    const parsed = ProductInventorySchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const product = await updateInventory(id, parsed.data.stockBaseQty);
    revalidateTag("products", {});
    return NextResponse.json(product);
}
