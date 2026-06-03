import { Prisma, OrderStatus, Unit, type Order, type OrderItem } from "@/generated/prisma/client";
import { z } from "zod";
import { DecimalStringSchema } from "@/types/products";

export type OrderRecord = Order;
export type OrderItemRecord = OrderItem;

export const OrderStatusSchema = z.nativeEnum(OrderStatus);
export type OrderStatusValue = z.infer<typeof OrderStatusSchema>;

export const UnitSchema = z.nativeEnum(Unit);
export type UnitValue = z.infer<typeof UnitSchema>;

export const OrderItemInputSchema = z.object({
    productId: z.string().min(1),
    orderedQty: DecimalStringSchema,
    orderedUnit: UnitSchema,
});

export type OrderItemInput = z.infer<typeof OrderItemInputSchema>;

export const OrderPreviewSchema = z.object({
    items: z.array(OrderItemInputSchema).min(1),
});

export type OrderPreviewBody = z.infer<typeof OrderPreviewSchema>;

export const OrderCreateSchema = OrderPreviewSchema.extend({
    sellerId: z.string().min(1).optional(),
});

export type OrderCreateBody = z.infer<typeof OrderCreateSchema>;

export const OrderStatusUpdateSchema = z.object({
    status: OrderStatusSchema,
});

export type OrderStatusUpdateBody = z.infer<typeof OrderStatusUpdateSchema>;

export const OrderAssignSchema = z.object({
    sellerId: z.string().min(1),
});

export type OrderAssignBody = z.infer<typeof OrderAssignSchema>;

export const OrderQuerySchema = z.object({
    status: OrderStatusSchema.optional(),
    buyerId: z.string().min(1).optional(),
    sellerId: z.string().min(1).optional(),
    take: z.string().regex(/^\d+$/).optional(),
    skip: z.string().regex(/^\d+$/).optional(),
});

export type OrderQueryInput = z.infer<typeof OrderQuerySchema>;

export type OrderItemCreateDbInput = {
    productId: string;
    orderedQty: Prisma.Decimal | string | number;
    orderedUnit: UnitValue;
    baseQty: Prisma.Decimal | string | number;
    unitPrice: Prisma.Decimal | string | number;
    totalPrice: Prisma.Decimal | string | number;
};

export type OrderCreateDbInput = {
    buyerId: string;
    sellerId?: string | null;
    totalAmount: Prisma.Decimal | string | number;
    items: OrderItemCreateDbInput[];
};
