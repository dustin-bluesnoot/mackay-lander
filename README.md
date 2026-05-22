# MacKay CEO Forums — Member Survey

A full-stack Next.js 14 web application for the MacKay CEO Forums annual member survey. Members complete a multi-step form, select Trusted Resource Partners, and receive personalized email introductions tracked via unique links.

## Prerequisites

- Node.js 18+
- npm 9+

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and set:
   - `DATABASE_URL` — SQLite path (default: `file:./dev.db`)
   - `ADMIN_PASSWORD` — your admin portal password (required)
   - `ADMIN_JWT_SECRET` — a long random string, 32+ characters (required)
   - `RESEND_API_KEY` — from [resend.com](https://resend.com) (optional for demo; emails skipped if missing)
   - `NEXT_PUBLIC_APP_URL` — your app URL, e.g. `http://localhost:3000`

3. **Initialize the database**
   ```bash
   npx prisma db push
   ```

4. **Seed with partners and default template**
   ```bash
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## Access

- **Survey**: [http://localhost:3000/survey/general](http://localhost:3000/survey/general)
- **Admin Portal**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
  - Use the `ADMIN_PASSWORD` you set in `.env.local`

## Admin Features

- **Dashboard** — overview stats and recent submissions
- **Partners** — manage Trusted Resource Partners (CRUD, logo upload, tier assignment)
- **Form Templates** — create/edit survey templates with custom questions and partner assignments
- **Submissions** — view all submissions with full details, CSV export

## Architecture

- **Framework**: Next.js 14 App Router with TypeScript
- **Styling**: Tailwind CSS (navy #1e3a5f / gold #c9a84c scheme)
- **Database**: Prisma ORM with SQLite (dev) — swap `DATABASE_URL` to PostgreSQL for production
- **Auth**: JWT via jose, stored as HttpOnly cookie
- **Email**: Resend transactional email with HTML templates
- **CRM Prefill**: HubSpot API (optional) — auto-fills contact info on Step 1
- **Logo Storage**: Cloudflare R2 (optional) — falls back to local `/public/logos/`
- **Rate Limiting**: In-memory, 5 submissions per IP per hour
- **Input Sanitization**: validator.js on all user inputs

## Deployment Notes

For production:
1. Switch `DATABASE_URL` to a PostgreSQL connection string
2. Set all optional env vars (Resend, HubSpot, R2)
3. Ensure `NEXT_PUBLIC_APP_URL` matches your production domain (used for tracking link generation)
4. Run `npm run build && npm start`
