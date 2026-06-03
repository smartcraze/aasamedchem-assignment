import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserByEmail, updateUser } from "@/lib/repository/users";
import { PublicSignUpSchema } from "@/types/auth";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const parsed = PublicSignUpSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { name, email, password, role } = parsed.data;

    try {
        await auth.api.signUpEmail({
            body: { name, email, password },
            headers: request.headers,
        });
    } catch (_error) {
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
