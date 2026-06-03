import { db } from "@/lib/prisma";
import { UserQueryInput, UserUpdateBody } from "@/types/users";

const userSelect = {
    id: true,
    name: true,
    email: true,
    role: true,
    createdAt: true,
    updatedAt: true,
};

export const listUsers = async (query: UserQueryInput) => {
    const where = {
        ...(query.q
            ? {
                OR: [
                    { name: { contains: query.q, mode: "insensitive" as const } },
                    { email: { contains: query.q, mode: "insensitive" as const } },
                ],
            }
            : {}),
        ...(query.role ? { role: query.role } : {}),
    };

    const take = query.take ? Number(query.take) : 20;
    const skip = query.skip ? Number(query.skip) : 0;

    const [items, total] = await Promise.all([
        db.user.findMany({
            where,
            take,
            skip,
            orderBy: { createdAt: "desc" },
            select: userSelect,
        }),
        db.user.count({ where }),
    ]);

    return {
        items,
        total,
        take,
        skip,
    };
};

export const getUserById = async (id: string) =>
    db.user.findUnique({ where: { id }, select: userSelect });

export const getUserByEmail = async (email: string) =>
    db.user.findUnique({ where: { email }, select: userSelect });

export const updateUser = async (id: string, input: UserUpdateBody) =>
    db.user.update({
        where: { id },
        data: {
            name: input.name,
            role: input.role,
        },
        select: userSelect,
    });

export const deleteUser = async (id: string) => db.user.delete({ where: { id } });
