import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/prisma";
import { getUserByEmail, listUsers } from "@/lib/repository/users";
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

    const existing = await getUserByEmail(email);
    if (existing) {
        return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: role ?? "BUYER",
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return NextResponse.json(user, { status: 201 });
}
