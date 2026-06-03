# AasaMedChem — Precision Chemical Inventory & Quotation Platform

AasaMedChem is an enterprise-grade chemical inventory and quotation management platform built for the chemical supply chain. The system supports multi-role access controls, implements strict canonical unit storage, and executes decimal-precise calculations with up to 6 decimal places of precision.

---

## 🌟 Core Features

### 🔐 Role-Based Access Control
- **Admin**: Full system control. Manage products (CRUD), update base units/rates, adjust stock levels, monitor users, and assign sellers.
- **Seller**: Operational management. View assigned orders, review quotations, and advance order status (Pending → Approved → Completed / Rejected).
- **Buyer**: Purchasing workflow. Browse the catalog, request quotations for single/multiple compounds, choose desired ordering units, and preview live price calculations.

### 📐 Precision Unit Conversion & Storage
- Centralized conversion formulas prevent calculation drift.
- Order in any supported unit (`kg`, `g`, `L`, `mL`, `items`); the system automatically converts and stores data in **internal base units** (`grams`, `milliliters`, `units`).
- Displays stock and pricing clearly in the UI using original ordered metrics and converted base structures side-by-side for audit transparency.

### 📈 Real-Time Dashboards & Analytics
- **Recharts-free SVG Dashboards**: Custom lightweight SVG graphs built directly in React (avoiding dependency bloat and React 19 warnings). Includes a 5-day sales trend line chart, quotation status donut chart, and a top-revenue compound ranking bar chart.
- **High-Performance Caching Layer**: Uses Next.js `unstable_cache` with dynamic keying based on queries, offering instantaneous response times (< 5ms) on dashboard indices, with automated `revalidateTag` invalidations on state changes.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: Next.js (App Router, Tailwind CSS, Lucide Icons, Radix UI via Shadcn).
- **Styling**: Luxury lab editorial print layout (Lora serif headings, sharp print margins, and monospace data layout).
- **Database**: Neon-hosted PostgreSQL.
- **ORM**: Prisma Client.
- **Auth**: Stateless token-based custom session cookie auth.

---

## 💾 Data Modeling & Conversion Strategy

### Database Schema Highlight (PostgreSQL types)
- **Decimal Precision**: All fields for weights, volume capacities, unit prices, and order totals utilize the `Decimal` type mapped to `db.Decimal(20, 6)`. PostgreSQL `NUMERIC` types are chosen over `FLOAT` to prevent binary floating-point rounding errors during multi-unit divisions.
- **Order Auditing**: The `OrderItem` stores both:
  - `orderedQty` and `orderedUnit` (exactly what the buyer typed).
  - `baseQty` (the converted canonical value).
  - `unitPrice` and `totalPrice` (calculated at base-unit rates).

### Canonical Unit Strategy
| Dimension | Internal Base Unit | External Display/Order Units | Conversion Logic (Internal to Base) |
|---|---|---|---|
| **Weight** | Grams (`g`) | Grams (`G`), Kilograms (`KG`) | `1 kg = 1000 g` |
| **Volume** | Milliliters (`mL`) | Milliliters (`ML`), Liters (`L`) | `1 L = 1000 mL` |
| **Count** | Units (`unit`) | Units (`UNIT`) | `1 unit = 1 unit` |

*Conversion formulas are centralized inside `lib/conversion.ts` and pricing calculations inside `app/api/orders/route.ts`.*

---

## 🔑 Test Credentials

You can log in to test each panel using the following seeded credentials (password for all is `password123`):

| Role | Email | Password | Allowed Capabilities |
|---|---|---|---|
| **Admin** | `admin@medchem.com` | `password123` | Create/edit products, manage users, view all orders |
| **Seller** | `seller@medchem.com` | `password123` | Review/approve orders assigned to them |
| **Buyer** | `buyer@medchem.com` | `password123` | Browse catalog, request new single/multi-item quotes |

---

## 🚀 Setup Instructions

### 1. Run Locally
Prerequisites: [Bun](https://bun.sh/) or Node.js.

1. Clone the repository and install dependencies:
   ```bash
   bun install
   ```

2. Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgres://[user]:[password]@[host]/[dbname]?sslmode=require"
   JWT_SECRET="generate-a-secure-random-string-here"
   ```

3. Run migrations and generate the client:
   ```bash
   bun prisma db push
   ```

4. Populate the database with the seed script (users and products):
   ```bash
   bun run db:seed
   ```

5. Launch the local dev server:
   ```bash
   bun run dev
   ```
   Open `http://localhost:3000` to access the application.

---

## 🌐 Deployment to Vercel

To host this project on Vercel:

1. **Push to GitHub**: Link your repository to GitHub.
2. **Create Vercel Project**: Go to Vercel, select **Add New Project**, and import the repository.
3. **Environment Variables**: Add your production variables in the Vercel dashboard:
   - `DATABASE_URL` (your Neon connection string)
   - `JWT_SECRET` (your session encryption string)
4. **Deploy**: Click deploy. Vercel automatically builds and optimizes the App Router routes.
