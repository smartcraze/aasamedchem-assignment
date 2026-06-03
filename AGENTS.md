<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->



# AGENTS.md

## Project Purpose

This project is an inventory and quotation/order management platform for AasaMedChem.

The platform supports:

* Admin
* Seller
* Buyer

and demonstrates:

* inventory management
* unit conversion
* quotation workflow
* precision-safe pricing calculations

---

# Core Principles

## 1. Always Store Base Units

Weight:

* grams internally

Volume:

* milliliters internally

Count:

* units/items internally

Never store mixed units in the database.

Examples:

GOOD:

* 2000 grams

BAD:

* 2 KG

---

## 2. Use Decimal Types

Use:

* PostgreSQL NUMERIC
* Prisma Decimal

Recommended:
Decimal @db.Decimal(20, 6)

Never use float for pricing or quantity calculations.

---

## 3. Keep Business Logic Centralized

Conversion logic should exist only inside:

* lib/conversion.ts

Price calculation logic should exist only inside:

* services/order-service.ts

Avoid duplicating formulas.

---

# Roles

## ADMIN

Full system access.

Can:

* manage products
* manage users
* monitor all orders

---

## SELLER

Operational role.

Can:

* review quotations
* approve/reject orders
* manage order status

Cannot:

* manage admins
* delete core system data

---

## BUYER

Customer role.

Can:

* browse products
* place quotations/orders
* view own orders

---

# Architecture Guidelines

## Frontend

* Next.js App Router
* Tailwind CSS

## Backend

* Server actions or route handlers

## Database

* Neon PostgreSQL

## ORM

* Prisma

---

# Important Rules

## Product Pricing

Store:

* pricePerBaseUnit

Examples:

* ₹2 per gram
* ₹0.5 per mL

Final formula:
totalPrice = baseQty * unitPrice

---

## Orders

Store BOTH:

* original ordered values
* converted internal values

This improves:

* auditability
* debugging
* transparency

---

# Folder Expectations

lib/

* shared utilities

services/

* business logic

app/

* route structure

components/

* reusable UI

---

# Code Quality Expectations

Prefer:

* reusable logic
* typed functions
* small components
* centralized calculations

Avoid:

* duplicated conversion logic
* mixed pricing formulas
* hardcoded values

---

# Priority Order

1. Correct unit conversion
2. Precision-safe calculations
3. Role-based access
4. Clean Prisma schema
5. Working order flow
6. UI polish

---

# Success Criteria

The project is considered successful if:

* products can be created
* buyers can place orders
* unit conversion works correctly
* prices calculate correctly
* seller/admin workflows function
* data remains precision-safe
