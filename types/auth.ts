import { z } from "zod";

export const RoleSchema = z.enum(["ADMIN", "SELLER", "BUYER"]);
export type Role = z.infer<typeof RoleSchema>;

export const SessionUserSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string(),
    role: RoleSchema,
});

export type SessionUser = z.infer<typeof SessionUserSchema>;
