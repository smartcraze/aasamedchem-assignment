import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { convertToBaseUnit } from "@/lib/conversion";
import { db } from "@/lib/prisma";
import requireBuyer from "@/lib/required-buyer";
import { OrderPreviewSchema } from "@/types/orders";

const toDecimal = (value: Prisma.Decimal | string | number) =>
  value instanceof Prisma.Decimal ? value : new Prisma.Decimal(value);

export async function POST(request: NextRequest) {
  const buyerCheck = await requireBuyer();
  if (buyerCheck) return buyerCheck;

  const body = await request.json();
  const parsed = OrderPreviewSchema.safeParse(body);

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
  const lines = items.map((item) => {
    const product = productMap.get(item.productId);
    if (!product) throw new Error("Product not found");

    const baseQty = convertToBaseUnit(product.dimension, item.orderedUnit, item.orderedQty);
    const unitPrice = toDecimal(product.pricePerBaseUnit);
    const totalPrice = baseQty.mul(unitPrice);
    totalAmount = totalAmount.add(totalPrice);

    return {
      productId: product.id,
      name: product.name,
      orderedQty: item.orderedQty,
      orderedUnit: item.orderedUnit,
      baseQty: baseQty.toString(),
      unitPrice: unitPrice.toString(),
      totalPrice: totalPrice.toString(),
    };
  });

  return NextResponse.json({
    items: lines,
    totalAmount: totalAmount.toString(),
  });
}
