import { NextRequest, NextResponse } from "next/server";
import { deleteUser, getUserById, updateUser } from "@/lib/repository/users";
import requireAdmin from "@/lib/required-admin";
import { UserUpdateSchema } from "@/types/users";
import { revalidateTag } from "next/cache";

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const adminCheck = await requireAdmin();
    if (adminCheck) return adminCheck;

    const { id } = await params;
    const user = await getUserById(id);

    if (!user) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(user);
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const adminCheck = await requireAdmin();
    if (adminCheck) return adminCheck;

    const { id } = await params;
    const body = await request.json();
    const parsed = UserUpdateSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const user = await updateUser(id, parsed.data);
    revalidateTag("users", {});
    return NextResponse.json(user);
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const adminCheck = await requireAdmin();
    if (adminCheck) return adminCheck;

    const { id } = await params;
    await deleteUser(id);
    revalidateTag("users", {});
    return NextResponse.json({ success: true });
}
