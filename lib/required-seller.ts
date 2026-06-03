import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";
import { RoleSchema } from "@/types/auth";

const requireSeller = async (request: NextRequest) => {
    const session = await auth.api.getSession({ headers: request.headers });
    const role = RoleSchema.safeParse((session?.user as { role?: unknown })?.role);

    if (!session?.user || !role.success) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (role.data !== "SELLER" && role.data !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return null;
};

export default requireSeller;
