import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/prisma";
import { OrderCreateDbInput, OrderQueryInput, OrderStatusValue } from "@/types/orders";

const toDecimal = (value: string | number | Prisma.Decimal) =>
    value instanceof Prisma.Decimal ? value : new Prisma.Decimal(value);

export const listOrders = async (query: OrderQueryInput) => {
    const where = {
        ...(query.status ? { status: query.status } : {}),
        ...(query.buyerId ? { buyerId: query.buyerId } : {}),
        ...(query.sellerId ? { sellerId: query.sellerId } : {}),
    };

    const take = query.take ? Number(query.take) : 20;
    const skip = query.skip ? Number(query.skip) : 0;

    const [items, total] = await Promise.all([
        db.order.findMany({
            where,
            take,
            skip,
            orderBy: { createdAt: "desc" },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                buyer: true,
                seller: true,
            },
        }),
        db.order.count({ where }),
    ]);

    return {
        items,
        total,
        take,
        skip,
    };
};

export const getOrderById = async (id: string) =>
    db.order.findUnique({
        where: { id },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
            buyer: true,
            seller: true,
        },
    });

export const createOrder = async (input: OrderCreateDbInput) =>
    db.order.create({
        data: {
            buyerId: input.buyerId,
            sellerId: input.sellerId ?? null,
            status: "PENDING",
            totalAmount: toDecimal(input.totalAmount),
            items: {
                create: input.items.map((item) => ({
                    productId: item.productId,
                    orderedQty: toDecimal(item.orderedQty),
                    orderedUnit: item.orderedUnit,
                    baseQty: toDecimal(item.baseQty),
                    unitPrice: toDecimal(item.unitPrice),
                    totalPrice: toDecimal(item.totalPrice),
                })),
            },
        },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
            buyer: true,
            seller: true,
        },
    });

export const updateOrderStatus = async (id: string, status: OrderStatusValue) =>
    db.order.update({
        where: { id },
        data: { status },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
            buyer: true,
            seller: true,
        },
    });

export const assignOrder = async (id: string, sellerId: string) =>
    db.order.update({
        where: { id },
        data: { sellerId },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
            buyer: true,
            seller: true,
        },
    });
