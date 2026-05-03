# PHOB — منصة بوف

Hotel-grade cleaning subscription platform — Next.js 16 frontend (App Router, AMDLRE stack).

Migrated from the original Vite project at `../PHOB-frontend.vite-backup` while preserving the original brand language (indigo accent, premium-rounded cards, Cairo + Inter fonts, RTL Arabic-first UI).

## Stack

- **Next.js 16** (App Router, Turbopack, React 19, async params)
- **@amdlre/design-system** (shadcn-based)
- **Tailwind CSS v4** with PHOB brand tokens (`brand-black`, `brand-accent`, `brand-offwhite`, ...)
- **next-intl** — Arabic (default) + English with full RTL/LTR
- **React Hook Form + Zod + Server Actions** for every form
- **Reusable fetch wrapper** in `src/lib/api/fetcher.ts` (SSR + client, httpOnly-cookie auth)
- **Google Maps** picker via `@googlemaps/js-api-loader` (v2 functional API)
- **Custom JWT auth** via FastAPI backend at `NEXT_PUBLIC_API_URL`

## Routes

```
/[locale]
├── /                       → redirects to /login or role dashboard
├── /(auth)/login           → single login form (email or phone)
├── /(auth)/register        → client registration
├── /(client)/              → client area (role: client)
│   ├── /dashboard
│   ├── /properties           list
│   ├── /properties/add
│   ├── /properties/[id]
│   ├── /subscriptions        list
│   ├── /subscriptions/new
│   ├── /requests             list
│   ├── /requests/new
│   └── /requests/[id]        countdown + guest-confirm + report
└── /employee/              → employee/admin area
    ├── /dashboard            stats + today's queue
    ├── /requests             filterable list
    ├── /requests/[id]        full client+property+sub view, status update, report upload
    ├── /subscriptions
    └── /properties
```

The `(client)` route group keeps client paths short (`/dashboard` not `/client/dashboard`), while `employee/` is a real URL segment so client and employee dashboards don't collide.

## Auth Flow

- One login form for every role; the JWT response carries `user.role`.
- After login, the user is redirected to `/dashboard` (client) or `/employee/dashboard` (employee/admin).
- Tokens are stored in **httpOnly cookies** (`access_token`, `refresh_token`).
- Middleware protects all non-public routes and redirects authenticated users away from `/login` and `/register`.

## Environment

Copy `.env.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
JWT_SECRET=match_backend_secret
```

## Develop

```bash
npm install
npm run dev          # → http://localhost:3000/ar
npm run build        # production build (Turbopack)
npm run lint
```

## Backend Endpoints

All endpoints are listed in `src/lib/api/endpoints.ts`. Auth, properties, subscriptions, requests, reports, notifications. The fetcher automatically attaches the bearer token on the server, and forwards cookies on the client.

## Migration Notes

- Original Vite source preserved at `/Users/basil/Desktop/AMD/phob/PHOB-frontend.vite-backup`.
- Brand tokens (`brand-black`, `brand-accent`, etc.) ported into `globals.css` so the design language matches the original.
- All in-memory mock data removed — every page calls FastAPI via the `api` wrapper.
- Role selection on the login page replaced with a single form; role comes from the JWT payload.
