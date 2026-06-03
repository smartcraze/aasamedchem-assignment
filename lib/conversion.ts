import { Prisma, ProductDimension, Unit } from "@/generated/prisma/client";

const toDecimal = (value: Prisma.Decimal | string | number) =>
  value instanceof Prisma.Decimal ? value : new Prisma.Decimal(value);

const getFactor = (dimension: ProductDimension, unit: Unit) => {
  if (dimension === "WEIGHT") {
    if (unit === "G") return 1;
    if (unit === "KG") return 1000;
  }

  if (dimension === "VOLUME") {
    if (unit === "ML") return 1;
    if (unit === "L") return 1000;
  }

  if (dimension === "COUNT") {
    if (unit === "UNIT") return 1;
  }

  throw new Error(`Invalid unit ${unit} for dimension ${dimension}`);
};

export const convertToBaseUnit = (
  dimension: ProductDimension,
  unit: Unit,
  value: Prisma.Decimal | string | number
) => {
  const factor = getFactor(dimension, unit);
  return toDecimal(value).mul(factor);
};

export const convertFromBaseUnit = (
  dimension: ProductDimension,
  unit: Unit,
  baseValue: Prisma.Decimal | string | number
) => {
  const factor = getFactor(dimension, unit);
  return toDecimal(baseValue).div(factor);
};
