import { NextRequest, NextResponse } from "next/server";
import { ProductUpdateSchema } from "@/types/products";
import { deleteProduct, getProductById, updateProduct } from "@/lib/repository/products";
import requireAdmin from "@/lib/required-admin";
import { revalidateTag } from "next/cache";

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(product);
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const adminCheck = await requireAdmin();
    if (adminCheck) return adminCheck;

    const { id } = await params;
    const body = await request.json();
    const parsed = ProductUpdateSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const product = await updateProduct(id, parsed.data);
    revalidateTag("products", {});
    return NextResponse.json(product);
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const adminCheck = await requireAdmin();
    if (adminCheck) return adminCheck;

    const { id } = await params;
    await deleteProduct(id);
    revalidateTag("products", {});
    return NextResponse.json({ success: true });
}
