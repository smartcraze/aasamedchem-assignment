import { Prisma, ProductDimension, type Product as PrismaProduct } from "@/generated/prisma/client";
import { z } from "zod";

export const ProductDimensionSchema = z.nativeEnum(ProductDimension);

export type Product = PrismaProduct;
export type ProductCreateInput = Prisma.ProductCreateInput;
export type ProductUpdateInput = Prisma.ProductUpdateInput;

export const DecimalStringSchema = z.preprocess(
    (value) => {
        if (typeof value === "number" && Number.isFinite(value)) {
            return value.toString();
        }
        if (typeof value === "string") {
            return value.trim();
        }
        return value;
    },
    z
        .string()
        .regex(/^\d+(\.\d{1,6})?$/, "Invalid decimal format")
        .refine((value) => Number(value) >= 0, "Must be non-negative")
);

export type DecimalString = z.infer<typeof DecimalStringSchema>;

export const ProductCreateSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    sku: z.string().min(1).optional(),
    dimension: ProductDimensionSchema,
    stockBaseQty: DecimalStringSchema,
    pricePerBaseUnit: DecimalStringSchema,
    isActive: z.boolean().optional(),
});

export type ProductCreateBody = z.infer<typeof ProductCreateSchema>;

export const ProductUpdateSchema = ProductCreateSchema.partial().extend({
    name: z.string().min(1).optional(),
});

export type ProductUpdateBody = z.infer<typeof ProductUpdateSchema>;

export const ProductInventorySchema = z.object({
    stockBaseQty: DecimalStringSchema,
});

export type ProductInventoryBody = z.infer<typeof ProductInventorySchema>;

export const ProductQuerySchema = z.object({
    q: z.string().optional(),
    dimension: ProductDimensionSchema.optional(),
    isActive: z.enum(["true", "false"]).optional(),
    take: z
        .string()
        .regex(/^\d+$/)
        .optional(),
    skip: z
        .string()
        .regex(/^\d+$/)
        .optional(),
});

export type ProductQueryInput = z.infer<typeof ProductQuerySchema>;
