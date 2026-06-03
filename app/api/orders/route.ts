import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { convertToBaseUnit } from "@/lib/conversion";
import getSessionRole from "@/lib/getsessionRole";
import { db } from "@/lib/prisma";
import { createOrder, listOrders } from "@/lib/repository/order";
import requireBuyer from "@/lib/required-buyer";
import requireSeller from "@/lib/required-seller";
import { OrderCreateSchema, OrderQuerySchema } from "@/types/orders";

const toDecimal = (value: Prisma.Decimal | string | number) =>
  value instanceof Prisma.Decimal ? value : new Prisma.Decimal(value);

export async function GET(request: NextRequest) {
  const { session, roleResult } = await getSessionRole();

  if (!session || !roleResult.success) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const parsed = OrderQuerySchema.safeParse({
    status: searchParams.get("status") ?? undefined,
    buyerId: searchParams.get("buyerId") ?? undefined,
    sellerId: searchParams.get("sellerId") ?? undefined,
    take: searchParams.get("take") ?? undefined,
    skip: searchParams.get("skip") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const role = roleResult.data;
  const query = { ...parsed.data };

  // Scope results to the caller's own orders
  if (role === "BUYER") {
    query.buyerId = session.id;
    query.sellerId = undefined;
  }
  if (role === "SELLER") {
    query.sellerId = session.id;
    query.buyerId = undefined;
  }

  const result = await listOrders(query);
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const buyerCheck = await requireBuyer();
  if (buyerCheck) return buyerCheck;

  const { session, roleResult } = await getSessionRole();
  if (!session || !roleResult.success) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = OrderCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const items = parsed.data.items;
  const productIds = items.map((item) => item.productId);
  const products = await db.product.findMany({
    where: { id: { in: productIds }, isActive: true },
  });

  if (products.length !== productIds.length) {
    return NextResponse.json({ error: "Invalid product selection" }, { status: 400 });
  }

  const productMap = new Map(products.map((product) => [product.id, product]));

  let totalAmount = new Prisma.Decimal(0);
  const orderItems = items.map((item) => {
    const product = productMap.get(item.productId);
    if (!product) throw new Error("Product not found");

    const baseQty = convertToBaseUnit(product.dimension, item.orderedUnit, item.orderedQty);
    const unitPrice = toDecimal(product.pricePerBaseUnit);
    const totalPrice = baseQty.mul(unitPrice);
    totalAmount = totalAmount.add(totalPrice);

    return {
      productId: product.id,
      orderedQty: item.orderedQty,
      orderedUnit: item.orderedUnit,
      baseQty,
      unitPrice,
      totalPrice,
    };
  });

  const role = roleResult.data;
  const sellerId = role === "ADMIN" ? (parsed.data.sellerId ?? null) : null;

  const order = await createOrder({
    buyerId: session.id,
    sellerId,
    totalAmount,
    items: orderItems,
  });

  return NextResponse.json(order, { status: 201 });
}
