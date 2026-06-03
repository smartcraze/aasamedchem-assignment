import { NextRequest, NextResponse } from "next/server";
import { deleteUser, getUserById, updateUser } from "@/lib/repository/users";
import requireAdmin from "@/lib/required-admin";
import { UserUpdateSchema } from "@/types/users";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const adminCheck = await requireAdmin(request);
    if (adminCheck) return adminCheck;

    const user = await getUserById(params.id);
    if (!user) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(user);
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const adminCheck = await requireAdmin(request);
    if (adminCheck) return adminCheck;

    const body = await request.json();
    const parsed = UserUpdateSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const user = await updateUser(params.id, parsed.data);
    return NextResponse.json(user);
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const adminCheck = await requireAdmin(request);
    if (adminCheck) return adminCheck;

    await deleteUser(params.id);
    return NextResponse.json({ success: true });
}
