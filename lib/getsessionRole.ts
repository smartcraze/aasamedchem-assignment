import { NextRequest } from "next/server";
import { auth } from "./auth";
import { RoleSchema } from "@/types/auth";

const getSessionRole = async (request: NextRequest) => {
    const session = await auth.api.getSession({ headers: request.headers });
    const roleResult = RoleSchema.safeParse((session?.user as { role?: unknown })?.role);
    return { session, roleResult };

};

export default getSessionRole;