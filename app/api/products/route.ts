import { NextRequest, NextResponse } from "next/server";
import {
    ProductCreateSchema,
    ProductQuerySchema,
} from "@/types/products";
import { createProduct, listProducts } from "@/lib/repository/products";
import requireAdmin from "@/lib/required-admin";





export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = ProductQuerySchema.safeParse({
        q: searchParams.get("q") ?? undefined,
        dimension: searchParams.get("dimension") ?? undefined,
        isActive: searchParams.get("isActive") ?? undefined,
        take: searchParams.get("take") ?? undefined,
        skip: searchParams.get("skip") ?? undefined,
    });

    if (!query.success) {
        return NextResponse.json({ error: query.error.flatten() }, { status: 400 });
    }

    const result = await listProducts(query.data);
    return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
    const adminCheck = await requireAdmin();
    if (adminCheck) return adminCheck;

    const body = await request.json();
    const parsed = ProductCreateSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const product = await createProduct(parsed.data);
    return NextResponse.json(product, { status: 201 });
}


