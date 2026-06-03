import { NextRequest, NextResponse } from "next/server";
import getSessionRole from "@/lib/getsessionRole";
import { getOrderById, updateOrderStatus } from "@/lib/repository/order";
import requireSeller from "@/lib/required-seller";
import { OrderStatusUpdateSchema } from "@/types/orders";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { session, roleResult } = await getSessionRole(request);
  if (!session?.user || !roleResult.success) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const order = await getOrderById(params.id);
  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const role = roleResult.data;
  if (
    role !== "ADMIN" &&
    order.buyerId !== session.user.id &&
    order.sellerId !== session.user.id
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(order);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const sellerCheck = await requireSeller(request);
  if (sellerCheck) return sellerCheck;

  const { session, roleResult } = await getSessionRole(request);
  if (!session?.user || !roleResult.success) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = OrderStatusUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const order = await getOrderById(params.id);
  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const role = roleResult.data;
  if (role === "SELLER" && order.sellerId && order.sellerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await updateOrderStatus(params.id, parsed.data.status);
  return NextResponse.json(updated);
}
