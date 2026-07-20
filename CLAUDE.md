# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

> **Next.js 16 warning (from AGENTS.md):** APIs, conventions, and file layout differ from older Next.js. Read the relevant guide in `node_modules/next/dist/docs/` before writing Next-specific code. One example already in the tree: middleware is `proxy.ts` at the repo root (not `middleware.ts`).

## What this is

Clone of chanan.vn — a Vietnamese far-infrared (FIR) health-care center site ("Tâm An Energy Healing"). Full-stack Next.js App Router app with a public storefront, an admin dashboard, REST API routes, and a Prisma/MySQL backend. All UI copy, comments, and validation messages are in Vietnamese — match that when editing user-facing text.

## Commands

```bash
yarn dev            # dev server (http://localhost:3000)
yarn build          # production build
yarn start          # production server
yarn lint           # eslint (flat config, next/core-web-vitals)

# Database (Prisma)
yarn db:generate    # regenerate Prisma client -> app/generated/prisma (also runs on postinstall)
yarn db:migrate     # prisma migrate dev
yarn db:push        # push schema without a migration
yarn db:studio      # Prisma Studio GUI
yarn db:seed        # tsx prisma/seed.ts (seeds admin/staff users + demo data)
yarn db:reset       # prisma migrate reset --force  (destructive)
```

There is **no test runner configured** — no `test` script and no test files. Do not assume `yarn test` exists.

Package manager is **yarn** (Yarn 1, pinned in `packageManager`). Seeded logins: `admin@chanan.vn / admin123`, `staff@chanan.vn / staff123`.

## Architecture

**Stack:** Next.js 16 (App Router, React 19, React Compiler on via `reactCompiler: true`), Prisma 6, **MySQL**, Zod validation, JWT auth, CSS Modules + a large `app/globals.css`, `sonner` toasts, `react-slick` carousels.

> ⚠️ **Database is MySQL**, per `prisma/schema.prisma` (`provider = "mysql"`). The README and `.env.example` mention PostgreSQL/Supabase — those are stale. Trust the schema. `DATABASE_URL` must be a MySQL connection string.

**Route groups** under `app/`:
- `(client)/` — public storefront. Vietnamese slug routes: `san-pham` (products), `dich-vu-cham-soc` (services), `kien-thuc` (articles), `dat-lich-hen` (appointments), `gio-hang` (cart), `lien-he` (contact), `tu-van-lieu-trinh` (consultation), `gioi-thieu` (about). Has its own `layout.js`.
- `(admin)/admin/` — admin area. `login/` is public; everything under the nested `(dashboard)/` group requires auth and renders the `Sidebar`. `admin/layout.tsx` is the shell.
- `api/` — REST route handlers grouped by resource (`products`, `services`, `articles`, `orders`, `appointments`, `contact`, `consultation`, `categories`, `reviews`, `auth`, `upload`, `settings`, `admin/*`).

**Auth** (`app/lib/auth.ts`): JWT stored in an httpOnly cookie named `chanan_auth_token`. Helpers: `hashPassword`/`verifyPassword` (bcrypt), `generateToken`/`verifyToken`, `getCurrentUser`, `requireAuth`, `requireRole`. `JWT_SECRET` is required at import time (throws if missing). `proxy.ts` gates `/admin/:path*` at the edge by checking the cookie exists and redirecting to `/admin/login`; **actual role/permission checks happen inside each API route** via `getCurrentUser()` — the proxy only checks token presence. Roles: `ADMIN`, `STAFF`, `CUSTOMER`.

**Prisma client is generated to a custom path** `app/generated/prisma` (not `@prisma/client`). Import the client type from `@/app/generated/prisma`. There are **two singleton wrappers** — use the right one:
- `app/lib/prisma.ts` → for app/runtime code (global key `prisma_v2`).
- `prisma/prisma.ts` → for standalone scripts (loads `dotenv/config`, global key `prisma`).

**API conventions:** route handlers return `NextResponse.json({ success, data?, error?, message?, pagination? })`. List endpoints accept `page`/`limit`/`search`/`sortBy`/`sortOrder` query params and return a `pagination` object. Public list endpoints filter `isActive: true` for anonymous users but return everything when `getCurrentUser()` is an ADMIN/STAFF ("admin mode"). Request bodies are validated with Zod schemas from `app/lib/validations.ts`.

**Server Actions** live in `app/actions/` (`product-actions.ts`, `service-actions.ts`) as an alternative to hitting the API from server components.

**Client state:** React Context — `app/context/CartContext.js` (cart, mounted globally with `<GlobalCart/>`) and `app/context/SettingsContext.js` (site settings from the `Setting` key/value table). Both wrap the app in the root `app/layout.js`.

**Path alias:** `@/*` → repo root (e.g. `@/app/lib/prisma`), configured in both `tsconfig.json` and `jsconfig.json`.

**Data model** (`prisma/schema.prisma`, all tables `@@map`-ed to snake_case): `User`, `Category`, `Product` (+ `ProductImage`, `ProductDetail` for gallery/rich HTML), `Order`/`OrderItem`, `Service`, `Article`, `ContactMessage`, `Appointment`, `ConsultationLead`, plus CMS-ish `Setting` (key/value grouped), `Slider`, `Testimonial`. IDs are `cuid()`. `Setting` drives `SettingsContext`.

## Conventions & gotchas

- **Mixed file types:** the codebase freely mixes `.js`, `.jsx`, `.ts`, `.tsx` (TypeScript `strict: false`, `allowJs: true`). Some modules exist in two forms during migration — e.g. `app/lib/email.js` **and** `app/lib/email.ts`. Check which one is actually imported before editing.
- **Images:** `next.config.mjs` allows local `/images/**` and remote `res.cloudinary.com`. Product/asset images are largely on Cloudinary; upload flow is `app/api/upload/` and the `scripts/upload-to-cloudinary.js` / `cloudinary-urls*.json` files.
- **Seeding/migration data** comes from JSON in `data/` (`products.json`, `services.json`, `articles.json`, `product_details.json`) via `prisma/seed.ts` and `prisma/migrate-from-json.ts`.
- **One-off maintenance scripts** are in `scripts/` (run with `tsx` or `node`); `scripts/` is excluded from `tsconfig` typechecking.
- **Prices:** VND. Format with `formatPrice()` from `app/lib/utils.js` (falls back to "Liên hệ" for 0/null). `Product.price` is a `Decimal`; `Service` stores loose price strings plus `priceMin`/`priceMax`.
- **Email** is sent via Nodemailer SMTP (`app/lib/email.ts`) on new contact messages and appointments.
- More endpoint detail lives in `docs/API.md`.
