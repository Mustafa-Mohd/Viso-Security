# Viso monorepo layout

| Folder | Purpose |
|--------|---------|
| `frontend/` | Public marketing site (Vite + React + TanStack Router) |
| `admin/` | CMS, HR, DMS, certificates, employee dashboard (`/admin`, `/employee-dashboard`) |
| `backend/` | Node API (`/api/chat`, `/api/send-email`), email service, SQL setup scripts |

## Commands (from repo root)

```bash
npm install
npm run dev              # frontend → http://localhost:5173
npm run dev:admin        # admin → http://localhost:5174
npm run dev:backend      # API only → http://localhost:8787 (/api/chat, /api/send-email)
npm run build            # production build for frontend → frontend/dist
npm run build:admin      # production build for admin → admin/dist
npm run build:backend    # typecheck backend API code
```

## Environment variables (local)

1. **Public (browser):** copy `frontend/.env.example` → **`frontend/.env`** (and **`admin/.env`** for admin). `VITE_*` only.

2. **Secrets (server):** copy `backend/.env.example` → **`backend/.env`**.

3. Vite `envDir` is each app folder. Dev `/api/*` plugins read **`backend/.env`**. Optional **`VITE_API_URL=http://localhost:8787`** when running `npm run dev:backend`.

4. `npm run dev:backend` loads `backend/.env` via `node --env-file=.env`.

5. **Never commit** `.env` files with real keys.

### What reads which variables

| Variable | Where | Used by |
|----------|--------|---------|
| `VITE_SUPABASE_*`, `VITE_ADMIN_APP_URL`, `VITE_CLOUDINARY_*`, `VITE_API_URL` | `frontend/.env`, `admin/.env` | Frontend & admin client (`import.meta.env`) |
| `GEMINI_API_KEY`, `RESEND_*`, `ADMIN_*`, `HR_*` | **`backend/.env`** | `npm run dev:backend`, production Node API |

### Security rules

| Location | Safe in browser? | Use for |
|----------|------------------|---------|
| `frontend/.env` / `admin/.env` — `VITE_*` only | Yes (bundled into the client) | Supabase anon key, Cloudinary preset, admin app URL |
| `backend/.env` — no `VITE_` prefix | No | Gemini, Resend, notification emails |

Do **not** put API keys in frontend/admin `.env` with a `VITE_` prefix. Chat and email go through `/api/chat` and `/api/send-email` using `backend/.env`.

## Production (VPS / static host)

- **Main site:** build `frontend/dist`, serve with nginx (or similar). SPA fallback: `try_files $uri $uri/ /index.html`.
- **Admin:** build `admin/dist`, serve on a subdomain (e.g. `admin.yourdomain.com`) with the same SPA fallback.
- **API:** run `npm run start -w @viso/backend` (or systemd service). Proxy `/api/` to the Node process (default port **8787**). Leave **`VITE_API_URL` unset** so the browser uses same-origin `/api/*`.
- Set **`VITE_*`** at build time; set **`backend/.env`** (or host env) on the server for secrets.

## SQL

Database setup scripts are in `backend/sql/`.
