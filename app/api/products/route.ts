import { NextRequest, NextResponse } from "next/server";
import {
    ProductCreateSchema,
    ProductQuerySchema,
} from "@/types/products";
import { createProduct, listProducts } from "@/lib/repository/products";
import requireAdmin from "@/lib/required-admin";
import { unstable_cache, revalidateTag } from "next/cache";

const getCachedProducts = (query: any) =>
  unstable_cache(
    async () => {
      const res = await listProducts(query);
      return JSON.parse(JSON.stringify(res));
    },
    ["products-list", JSON.stringify(query)],
    { tags: ["products"], revalidate: 3600 }
  )();





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

    const result = await getCachedProducts(query.data);
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
    revalidateTag("products", {});
    return NextResponse.json(product, { status: 201 });
}


