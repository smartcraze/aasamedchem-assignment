import { db } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Starting database seed...");

  console.log("Clearing existing records...");
  await db.orderItem.deleteMany();
  await db.order.deleteMany();
  await db.product.deleteMany();
  await db.user.deleteMany();

  const hashedPassword = await bcrypt.hash("password123", 10);

  // 3. Create Seed Users
  console.log("Seeding users...");
  const admin = await db.user.create({
    data: {
      name: "Admin User",
      email: "admin@medchem.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  const seller = await db.user.create({
    data: {
      name: "Seller User",
      email: "seller@medchem.com",
      password: hashedPassword,
      role: "SELLER",
    },
  });

  const buyer = await db.user.create({
    data: {
      name: "Buyer User",
      email: "buyer@medchem.com",
      password: hashedPassword,
      role: "BUYER",
    },
  });

  console.log(`Users seeded: Admin (${admin.email}), Seller (${seller.email}), Buyer (${buyer.email})`);

  // 4. Create Seed Products
  console.log("Seeding products...");
  const products = [
    {
      name: "Aspirin (Acetylsalicylic Acid)",
      sku: "ASP-001",
      dimension: "WEIGHT" as const,
      stockBaseQty: 50000, // 50kg internally stored in grams
      pricePerBaseUnit: 0.05, // ₹0.05 per gram
      isActive: true,
      description: "High-purity Acetylsalicylic Acid for synthesis and formulation validation.",
    },
    {
      name: "Paracetamol (Acetaminophen)",
      sku: "PAR-002",
      dimension: "WEIGHT" as const,
      stockBaseQty: 100000, // 100kg internally stored in grams
      pricePerBaseUnit: 0.03, // ₹0.03 per gram
      isActive: true,
      description: "Analgesic compound for analytical testing standards.",
    },
    {
      name: "Ethanol (Anhydrous)",
      sku: "ETH-003",
      dimension: "VOLUME" as const,
      stockBaseQty: 25000, // 25L internally stored in milliliters
      pricePerBaseUnit: 0.12, // ₹0.12 per mL
      isActive: true,
      description: "Anhydrous solvent, moisture content < 0.005%, ideal for moisture-sensitive reactions.",
    },
    {
      name: "Methanol (HPLC Grade)",
      sku: "MET-004",
      dimension: "VOLUME" as const,
      stockBaseQty: 15000, // 15L internally stored in milliliters
      pricePerBaseUnit: 0.18, // ₹0.18 per mL
      isActive: true,
      description: "High-performance liquid chromatography grade methanol.",
    },
    {
      name: "Glass Vials (10mL)",
      sku: "VIA-005",
      dimension: "COUNT" as const,
      stockBaseQty: 2500, // 2500 units
      pricePerBaseUnit: 12.50, // ₹12.50 per unit
      isActive: true,
      description: "Clear borosilicate glass vials with rubber stoppers and aluminum seals.",
    },
    {
      name: "Sterile Petri Dishes (90mm)",
      sku: "PET-006",
      dimension: "COUNT" as const,
      stockBaseQty: 800, // 800 units
      pricePerBaseUnit: 24.00, // ₹24.00 per unit
      isActive: true,
      description: "Standard triple-vented sterile polystyrene petri dishes for cell cultures.",
    },
  ];

  for (const prod of products) {
    await db.product.create({ data: prod });
  }

  console.log(`Seeded ${products.length} products successfully.`);
  console.log("Database seed completed successfully.");
}

main()
  .then(async () => {
    // Keep connection alive or close safely
  })
  .catch(async (e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  });
