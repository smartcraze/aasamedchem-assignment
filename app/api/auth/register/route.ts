import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/prisma";
import { getUserByEmail } from "@/lib/repository/users";
import { PublicSignUpSchema } from "@/types/auth";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const parsed = PublicSignUpSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { name, email, password, role } = parsed.data;

    const existing = await getUserByEmail(email);
    if (existing) {
        return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: role ?? "BUYER",
        },
    });

    const user = await getUserByEmail(email);
    if (!user) {
        return NextResponse.json({ error: "User creation failed" }, { status: 500 });
    }

    return NextResponse.json(user, { status: 201 });
}
