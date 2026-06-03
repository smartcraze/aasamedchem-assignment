import { NextRequest, NextResponse } from "next/server";
import requireAdmin from "@/lib/required-admin";
import { assignOrder, getOrderById } from "@/lib/repository/order";
import { OrderAssignSchema } from "@/types/orders";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminCheck = await requireAdmin();
  if (adminCheck) return adminCheck;

  const { id } = await params;

  const body = await request.json();
  const parsed = OrderAssignSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await getOrderById(id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await assignOrder(id, parsed.data.sellerId);
  return NextResponse.json(updated);
}
