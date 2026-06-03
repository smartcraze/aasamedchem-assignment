import { z } from "zod";
import { RoleSchema } from "@/types/auth";

export const UserCreateSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8),
    role: RoleSchema.optional(),
});

export type UserCreateBody = z.infer<typeof UserCreateSchema>;

export const UserUpdateSchema = z.object({
    name: z.string().min(1).optional(),
    role: RoleSchema.optional(),
});

export type UserUpdateBody = z.infer<typeof UserUpdateSchema>;

export const UserQuerySchema = z.object({
    q: z.string().optional(),
    role: RoleSchema.optional(),
    take: z.string().regex(/^\d+$/).optional(),
    skip: z.string().regex(/^\d+$/).optional(),
});

export type UserQueryInput = z.infer<typeof UserQuerySchema>;
