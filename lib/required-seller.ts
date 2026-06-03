import { NextResponse } from "next/server";
import getSessionRole from "@/lib/getsessionRole";

const requireSeller = async () => {
    const { session, roleResult } = await getSessionRole();

    if (!session || !roleResult.success) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (roleResult.data !== "SELLER" && roleResult.data !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return null;
};

export default requireSeller;
