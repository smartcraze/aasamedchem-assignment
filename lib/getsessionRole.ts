import { getSession } from "./auth";
import { RoleSchema } from "@/types/auth";

const getSessionRole = async () => {
    const session = await getSession();
    const roleResult = RoleSchema.safeParse(session?.role);
    return { session, roleResult };
};

export default getSessionRole;