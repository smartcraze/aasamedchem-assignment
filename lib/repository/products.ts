import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/prisma";
import {
    ProductCreateBody,
    ProductQueryInput,
    ProductUpdateBody,
} from "@/types/products";

const toDecimal = (value: string | number | Prisma.Decimal) =>
    value instanceof Prisma.Decimal ? value : new Prisma.Decimal(value);

export const listProducts = async (query: ProductQueryInput) => {
    const where = {
        ...(query.q
            ? {
                OR: [
                    { name: { contains: query.q, mode: "insensitive" as const } },
                    { sku: { contains: query.q, mode: "insensitive" as const } },
                ],
            }
            : {}),
        ...(query.dimension ? { dimension: query.dimension } : {}),
        ...(query.isActive
            ? { isActive: query.isActive === "true" }
            : {}),
    };

    const take = query.take ? Number(query.take) : 20;
    const skip = query.skip ? Number(query.skip) : 0;

    const [items, total] = await Promise.all([
        db.product.findMany({
            where,
            take,
            skip,
            orderBy: { createdAt: "desc" },
        }),
        db.product.count({ where }),
    ]);

    return {
        items,
        total,
        take,
        skip,
    };
};

export const getProductById = async (id: string) =>
    db.product.findUnique({ where: { id } });

export const createProduct = async (input: ProductCreateBody) =>
    db.product.create({
        data: {
            name: input.name,
            description: input.description ?? null,
            sku: input.sku ?? null,
            dimension: input.dimension,
            stockBaseQty: toDecimal(input.stockBaseQty),
            pricePerBaseUnit: toDecimal(input.pricePerBaseUnit),
            isActive: input.isActive ?? true,
        },
    });

export const updateProduct = async (id: string, input: ProductUpdateBody) =>
    db.product.update({
        where: { id },
        data: {
            name: input.name,
            description: input.description ?? undefined,
            sku: input.sku ?? undefined,
            dimension: input.dimension,
            stockBaseQty: input.stockBaseQty
                ? toDecimal(input.stockBaseQty)
                : undefined,
            pricePerBaseUnit: input.pricePerBaseUnit
                ? toDecimal(input.pricePerBaseUnit)
                : undefined,
            isActive: input.isActive,
        },
    });

export const updateInventory = async (id: string, stockBaseQty: string) =>
    db.product.update({
        where: { id },
        data: {
            stockBaseQty: toDecimal(stockBaseQty),
        },
    });

export const deleteProduct = async (id: string) =>
    db.product.delete({ where: { id } });
