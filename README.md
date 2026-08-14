# Trueline Spectrum

**The Professional Knowledge Ecosystem for Education, Research, Technology, Industry and Innovation.**

A professional digital magazine and media platform — public editorial website + a custom admin CMS + an online digital magazine reader.

## Tech stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS** (strict brand design system)
- **Prisma ORM** — SQLite for local dev, **PostgreSQL-portable** (see below)
- **Admin-only authentication** — bcrypt password hashing + `jose` JWT in an httpOnly cookie, enforced by middleware
- No external UI libraries beyond `lucide-react` icons

## Brand system (strict)

Only these colors are used across the app:

| Token | Hex | Usage |
|-------|-----|-------|
| Primary Green | `#00A99D` | CTAs, links, active nav, accents |
| Primary Blue (Navy) | `#002C71` | Headings, nav, footer, premium |
| Gray | `#5E5858` | Secondary text, metadata |
| White | `#FFFFFF` | Background / contrast |

The official logo lives at `public/brand/trueline-spectrum-logo.jpg`.

## Getting started

```bash
npm install
npm run db:push      # create the SQLite schema
npm run db:seed      # load sample editorial content + admin user
npm run dev          # http://localhost:3000
```

Production:

```bash
npm run build
npm start
```

### Default admin credentials (seeded — change after first login)

- URL: `/admin/login`
- Email: `admin@truelinespectrum.com`
- Password: `Admin@12345`

Configured via `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in `.env`.

## Moving to PostgreSQL

The schema is written to be Postgres-portable (no native enums/arrays; enum-like
fields are validated in `src/lib/constants.ts`). To switch:

1. In `prisma/schema.prisma`, set `datasource db { provider = "postgresql" }`.
2. Set `DATABASE_URL` to your Postgres connection string in `.env`.
3. `npm run db:push && npm run db:seed`.

No application code changes are required.

## Project structure

```
prisma/
  schema.prisma        # data model (Admin, Article, Research, Event, Organization,
                       #   Magazine/MagazinePage, Category, Tag, Author, PremiumPlan,
                       #   Advertisement, NewsletterSubscriber, HomepageSection,
                       #   TickerItem, MediaAsset, SiteSetting, AuditLog)
  seed.ts              # sample content + admin
src/
  app/(public)/        # public website (header/ticker/footer layout)
  app/admin/(auth)/    # /admin/login (unprotected)
  app/admin/(panel)/   # protected CMS (sidebar shell)
  app/api/             # newsletter + admin login/logout
  components/          # site / content / home / admin / magazine components
  lib/                 # db, auth, queries, admin helpers, constants, utils
  middleware.ts        # protects /admin and /api/admin
```

## Public site

Home · News · Technology · AI · Research · Education · Industry · Startups ·
Magazine · Events · More (Organizations, Innovation, Patents, Science, Rankings) ·
Search · Premium.

- **Homepage** is fully CMS-driven (section order/visibility in `/admin/homepage`);
  the hero uses whichever article is flagged *Featured*.
- **Digital magazine reader** (`/magazine/[slug]/read`) — cover, table of contents,
  page navigation, thumbnails, zoom, fullscreen and reading progress. **Read online
  only — no PDF download.**
- **Premium plans** are display-only. No payment/checkout is implemented (the
  architecture is future-ready for it).
- **No public sign-up / reader accounts / videos** — by design for this release.

## Admin CMS

Full CRUD with an editorial workflow (Draft → Pending → Approved → Scheduled →
Published → Archived) for Articles, plus Research, Events, Organizations, Magazines
(with reader pages), Categories, Authors, Premium Plans, Advertisements, Media
Library, Homepage/Ticker, Newsletter subscribers, Site Settings, and an Audit Log.

## Security

Secure password hashing (bcrypt), signed httpOnly session cookies, middleware-
protected admin routes, role helpers, input validation (zod), login rate-limiting,
audit logging, and security response headers. Admin functionality is never exposed
to public users.
