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

export const PublicRoleSchema = z.enum(["BUYER", "SELLER"]);
export type PublicRole = z.infer<typeof PublicRoleSchema>;

export const PublicSignUpSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8),
    role: PublicRoleSchema.optional(),
});

export type PublicSignUpBody = z.infer<typeof PublicSignUpSchema>;
