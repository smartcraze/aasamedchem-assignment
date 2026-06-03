import { NextRequest, NextResponse } from "next/server";

import { ProductUpdateSchema } from "@/types/products";
import {
    deleteProduct,
    getProductById,
    updateProduct,
} from "@/lib/repository/products";
import requireAdmin from "@/lib/required-admin";


export async function GET(
    _request: NextRequest,
    { params }: { params: { id: string } }
) {
    const product = await getProductById(params.id);

    if (!product) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(product);
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const adminCheck = await requireAdmin(request);
    if (adminCheck) return adminCheck;

    const body = await request.json();
    const parsed = ProductUpdateSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const product = await updateProduct(params.id, parsed.data);
    return NextResponse.json(product);
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const adminCheck = await requireAdmin(request);
    if (adminCheck) return adminCheck;

    await deleteProduct(params.id);
    return NextResponse.json({ success: true });
}
