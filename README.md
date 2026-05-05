# NeechBakra — E-commerce Storefront

> Wear the Madness. Own the Game.

Production-ready React + Convex e-commerce store for the NeechBakra gaming/streetwear brand.

## Stack

- **Frontend:** React 19 + Vite 6 + Tailwind CSS v4
- **State:** Redux Toolkit (cart, wishlist, UI) + Convex (server data)
- **Backend:** Convex (DB, queries, mutations, actions, file storage, auth)
- **Auth:** `@convex-dev/auth` (Password provider)
- **Payments:** Razorpay Standard Checkout (server-side order creation, HMAC-SHA256 signature verification)
- **Routing:** React Router v7
- **Forms:** react-hook-form
- **Icons:** lucide-react

## First-time Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Convex (interactive — needs your login)

```bash
npx convex dev
```

This will:
- Open a browser tab to log you in (or sign up)
- Ask you to create or pick a project
- Write `VITE_CONVEX_URL` and `CONVEX_DEPLOYMENT` to `.env.local`
- Replace the stub `convex/_generated/` files with real codegen
- Push the schema and start watching for backend changes

Leave this running in its own terminal — it auto-deploys backend code as you edit.

### 3. Configure Razorpay

Get your test keys from <https://dashboard.razorpay.com/app/keys>.

**Frontend key** — add to `.env.local`:

```env
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```

**Backend secret** — set as Convex env vars (NEVER put the secret in `.env.local`):

```bash
npx convex env set RAZORPAY_KEY_ID rzp_test_xxxxxxxxxxxx
npx convex env set RAZORPAY_KEY_SECRET your_razorpay_secret_key
```

### 4. Seed sample products

In a separate terminal (with `npx convex dev` still running in the first):

```bash
npx convex run seed:seedProducts
```

This creates 5 categories (Hoodies, Tees, Caps, Mousepads, Stickers) and 10 sample NeechBakra products.

### 5. Promote yourself to admin (optional but recommended)

Sign up via the Login page first, then in Convex dashboard:

1. Open <https://dashboard.convex.dev>, pick your deployment.
2. Go to **Data → users**.
3. Find your user record and change `role` from `"user"` to `"admin"`.

You'll now see the admin dashboard link in the navbar.

### 6. Run the dev server

```bash
npm run dev
```

Open <http://localhost:5173>.

## Project Structure

```
convex/                    # Backend (auto-deployed by `npx convex dev`)
  schema.ts                # All tables, indexes, validators
  auth.ts, http.ts         # Convex Auth setup
  users.ts                 # Profile, role, getMe
  products.ts              # Public list + admin CRUD
  categories.ts            # Category management
  orders.ts                # Create order, list, update status
  payments.ts              # Razorpay actions: createRazorpayOrder, verifyPayment
  paymentRecords.ts        # Payment history mutations
  contact.ts, newsletter.ts
  admin.ts                 # Dashboard stats
  seed.ts                  # Sample product seed

src/
  app/store.js             # Redux store with localStorage persistence
  features/
    cart/cartSlice.js
    wishlist/wishlistSlice.js
    ui/uiSlice.js
  lib/
    utils.js               # formatPrice, calculateOrderTotals, etc.
    razorpay.js            # Razorpay SDK loader + checkout opener
  components/
    common/                # ProtectedRoute, AdminRoute, EmptyState, etc.
    layout/                # Navbar, Footer, Layout
    product/               # ProductCard, ProductGrid, Filters, Selectors
    cart/                  # CartDrawer
    checkout/              # CheckoutSummary, RazorpayButton
  pages/                   # 19 pages (Home, Shop, Cart, Admin*, etc.)
  routes/AppRoutes.jsx     # Lazy-loaded routes
```

## The Razorpay Flow

1. User fills shipping address → frontend calls `orders.createOrder` mutation → returns `orderId` (Convex)
2. User clicks **Pay** → `RazorpayButton` calls `payments.createRazorpayOrder` action
3. Action runs server-side: hits `https://api.razorpay.com/v1/orders` with secret key, gets back a `razorpay_order_id`
4. Frontend opens Razorpay Standard Checkout with the `razorpay_order_id` and the public `KEY_ID`
5. User pays → Razorpay returns `razorpay_payment_id`, `razorpay_order_id`, `razorpay_signature`
6. Frontend calls `payments.verifyPayment` action
7. Server computes `HMAC-SHA256(razorpay_order_id + "|" + razorpay_payment_id, secret)` and compares
8. Match → mark order `paid` + `confirmed`. Mismatch → mark `failed` + `cancelled`
9. Frontend redirects to `/order/success` or `/order/failed`

**The Razorpay secret key never leaves the Convex backend.**

## Testing the Payment Flow (Razorpay test mode)

In Razorpay test mode use:

- **Card:** `4111 1111 1111 1111`, any future expiry, any CVV, any name
- **OTP / 3D-Secure:** `1234` or `123456`
- **UPI:** `success@razorpay`

## Pages

| Route | Description | Auth |
|---|---|---|
| `/` | Home (hero, featured, brand story, countdown, newsletter) | Public |
| `/shop` | Product grid with filters | Public |
| `/shop/:slug` | Product details + size/quantity + add to cart | Public |
| `/cart` | Cart with line items, totals, checkout CTA | Public |
| `/wishlist` | Saved items | Public |
| `/about`, `/contact` | Brand pages | Public |
| `/terms`, `/privacy`, `/refund-policy`, `/shipping-policy` | Legal | Public |
| `/auth` | Sign in / Sign up | Public |
| `/checkout` | Address form + Razorpay button | Auth |
| `/order/success`, `/order/failed`, `/order/:id` | Post-payment | Auth |
| `/profile` | Update name/phone, sidebar to orders/wishlist | Auth |
| `/orders` | List of user's orders with status | Auth |
| `/admin` | Stats dashboard | Admin |
| `/admin/products` | CRUD products + activate/deactivate | Admin |
| `/admin/orders` | View all orders, update status, view details | Admin |

## Scripts

```bash
npm run dev       # Start Vite dev server
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # ESLint
```

## Troubleshooting

- **"No CONVEX_DEPLOYMENT set":** Run `npx convex dev` once first.
- **"VITE_RAZORPAY_KEY_ID not set":** Add it to `.env.local` and restart `npm run dev`.
- **Lucide icon errors after upgrading:** clear `node_modules/.vite` and restart.
- **`getMe` returns null after signing up:** check that `ensureUserRecord` was called; sign out and back in.

## License

ISC — NeechBakra brand assets are property of NeechBakra. Code is yours to fork & remix.
