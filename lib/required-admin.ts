import { NextResponse } from "next/server";
import getSessionRole from "@/lib/getsessionRole";

const requireAdmin = async () => {
    const { session, roleResult } = await getSessionRole();

    if (!session || !roleResult.success || roleResult.data !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return null;
};

export default requireAdmin;