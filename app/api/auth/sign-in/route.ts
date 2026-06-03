import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/prisma";
import { setSessionCookie } from "@/lib/auth";
import { z } from "zod";

const SignInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export async function POST(request: NextRequest) {
    const body = await request.json();
    const parsed = SignInSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            { error: "Invalid email or password." },
            { status: 400 }
        );
    }

    const { email, password } = parsed.data;

    const user = await db.user.findUnique({ where: { email } });

    if (!user || !user.password) {
        return NextResponse.json(
            { error: "Invalid email or password." },
            { status: 401 }
        );
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        return NextResponse.json(
            { error: "Invalid email or password." },
            { status: 401 }
        );
    }

    await setSessionCookie({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
    });

    return NextResponse.json(
        { id: user.id, email: user.email, name: user.name, role: user.role },
        { status: 200 }
    );
}
