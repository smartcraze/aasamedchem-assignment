import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserByEmail, listUsers, updateUser } from "@/lib/repository/users";
import requireAdmin from "@/lib/required-admin";
import { UserCreateSchema, UserQuerySchema } from "@/types/users";

export async function GET(request: NextRequest) {
    const adminCheck = await requireAdmin(request);
    if (adminCheck) return adminCheck;

    const { searchParams } = new URL(request.url);
    const query = UserQuerySchema.safeParse({
        q: searchParams.get("q") ?? undefined,
        role: searchParams.get("role") ?? undefined,
        take: searchParams.get("take") ?? undefined,
        skip: searchParams.get("skip") ?? undefined,
    });

    if (!query.success) {
        return NextResponse.json({ error: query.error.flatten() }, { status: 400 });
    }

    const result = await listUsers(query.data);
    return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
    const adminCheck = await requireAdmin(request);
    if (adminCheck) return adminCheck;

    const body = await request.json();
    const parsed = UserCreateSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { name, email, password, role } = parsed.data;

    try {
        await auth.api.signUpEmail({
            body: { name, email, password },
            headers: request.headers,
        });
    } catch (error) {
        return NextResponse.json({ error: "Unable to create user" }, { status: 400 });
    }

    let user = await getUserByEmail(email);
    if (!user) {
        return NextResponse.json({ error: "User creation failed" }, { status: 500 });
    }

    if (role && role !== user.role) {
        user = await updateUser(user.id, { role });
    }

    return NextResponse.json(user, { status: 201 });
}
