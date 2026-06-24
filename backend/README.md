# Backend — REST API

Express + TypeScript API for the bakery platform, backed by **MySQL** via **Prisma ORM 7**.

## Requirements

- Node.js 20+
- MySQL 8+ or MariaDB

## Setup

```bash
npm install
cp .env.example .env
```

Edit `.env` and set your MySQL connection string:

```env
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/tort_bakery"
```

Create the database if it does not exist:

```sql
CREATE DATABASE tort_bakery CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Apply migrations and seed Armenian reference data:

```bash
npx prisma migrate dev
npm run seed
```

## Scripts

| Command           | Description                          |
|-------------------|--------------------------------------|
| `npm run dev`     | Start dev server with hot reload     |
| `npm run start`   | Start production server              |
| `npm run seed`    | Seed categories, fruits, nuts, etc.  |
| `npx prisma studio` | Visual database browser            |

## API

Base URL: `http://localhost:5000/api`

| Endpoint            | Description                |
|---------------------|----------------------------|
| `GET /health`       | Health + DB connectivity   |
| `GET /categories`   | List categories            |
| `GET /cakes`        | List cakes (filters, search) |
| `GET /builder-options` | Builder dropdown data   |
| `POST /orders`      | Create custom/catalog order |
| …                   | Full CRUD for all entities |

Query params `search` and `active=true` work on list endpoints. Search matches Armenian text and Latin transliterations (e.g. `elak` → `Ելակ`).

## Prisma

- Schema: `prisma/schema.prisma`
- Migrations: `prisma/migrations/`
- Seed: `prisma/seed.ts` (configured in `prisma.config.ts`)
- Client singleton: `src/lib/prisma.ts` (MariaDB adapter)

Regenerate the client after schema changes:

```bash
npx prisma generate
```

## Optional notifications

Set in `.env` to receive alerts on new orders:

- `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID`
- `SMTP_*` + `NOTIFY_EMAIL` (email hook ready for nodemailer)
