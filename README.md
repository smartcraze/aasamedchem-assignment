This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## API Routes

### Auth (Better Auth)

- `GET /api/auth/ok` - health check
- `GET /api/auth/session` - current session
- `POST /api/auth/register` - public sign up (buyer or seller)
- `GET|POST|PATCH|PUT|DELETE /api/auth/*` - Better Auth handler endpoints

### Products

- `GET /api/products` - list products (query: `q`, `dimension`, `isActive`, `take`, `skip`)
- `POST /api/products` - create product (admin)
- `GET /api/products/[id]` - get product
- `PATCH /api/products/[id]` - update product (admin)
- `DELETE /api/products/[id]` - delete product (admin)
- `PATCH /api/products/[id]/inventory` - update stock (admin)

### Orders

- `GET /api/orders` - list orders (query: `status`, `buyerId`, `sellerId`, `take`, `skip`)
- `POST /api/orders` - create order (buyer)
- `POST /api/orders/preview` - price preview (buyer)
- `GET /api/orders/[id]` - order details
- `PATCH /api/orders/[id]` - update order status (seller/admin)
- `PATCH /api/orders/[id]/assign` - assign seller (admin)

### Users (Admin)

- `GET /api/users` - list users (query: `q`, `role`, `take`, `skip`)
- `POST /api/users` - create user (admin)
- `GET /api/users/[id]` - get user (admin)
- `PATCH /api/users/[id]` - update user (admin)
- `DELETE /api/users/[id]` - delete user (admin)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
