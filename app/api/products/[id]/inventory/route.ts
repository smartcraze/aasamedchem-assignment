import { NextRequest, NextResponse } from "next/server";
import { ProductInventorySchema } from "@/types/products";
import { updateInventory } from "@/lib/repository/products";
import requireSeller from "@/lib/required-seller";
import { revalidateTag } from "next/cache";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const sellerCheck = await requireSeller();
    if (sellerCheck) return sellerCheck;

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
