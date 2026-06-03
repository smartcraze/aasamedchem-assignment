import { NextRequest, NextResponse } from "next/server";
import getSessionRole from "@/lib/getsessionRole";
import { getOrderById, updateOrderStatus } from "@/lib/repository/order";
import requireSeller from "@/lib/required-seller";
import { OrderStatusUpdateSchema } from "@/types/orders";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { session, roleResult } = await getSessionRole();

  if (!session || !roleResult.success) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const order = await getOrderById(id);
  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Buyers can only see their own orders; sellers/admins see all
  const role = roleResult.data;
  if (role !== "ADMIN" && order.buyerId !== session.id && order.sellerId !== session.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(order);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const sellerCheck = await requireSeller();
  if (sellerCheck) return sellerCheck;

  const { session, roleResult } = await getSessionRole();
  if (!session || !roleResult.success) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = OrderStatusUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const order = await getOrderById(id);
  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // A seller can only update orders assigned to them
  const role = roleResult.data;
  if (role === "SELLER" && order.sellerId && order.sellerId !== session.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await updateOrderStatus(id, parsed.data.status);
  return NextResponse.json(updated);
}
