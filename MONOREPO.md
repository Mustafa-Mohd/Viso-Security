# Viso monorepo layout



| Folder | Purpose |

|--------|---------|

| `frontend/` | Public marketing site (Vite + React + TanStack Router) |

| `admin/` | CMS, HR, DMS, certificates, employee dashboard (`/admin`, `/employee-dashboard`) |

| `backend/` | Netlify serverless functions, email service, SQL setup scripts |



## Commands (from repo root)



```bash

npm install

npm run dev              # frontend → http://localhost:5173

npm run dev:admin        # admin → http://localhost:5174

npm run dev:backend      # API only → http://localhost:8787 (/api/chat, /api/send-email)

npm run build            # production build for frontend (Netlify publish path)

npm run build:admin      # production build for admin (separate deploy)

```



## Environment variables (local only)



1. **Public (browser):** copy `frontend/.env.example` → **`frontend/.env`** (and **`admin/.env`** for admin). `VITE_*` only.

2. **Secrets (server):** copy `backend/.env.example` → **`backend/.env`**.

3. Vite `envDir` is each app folder. Dev `/api/*` plugins read **`backend/.env`**. Optional **`VITE_API_URL=http://localhost:8787`** when running `npm run dev:backend`.

4. `npm run dev:backend` loads `backend/.env` via `node --env-file=.env`.

5. **Never commit** `.env` files with real keys. In **production**, set the same names in Netlify.



### What reads which variables



| Variable | Where | Used by |

|----------|--------|---------|

| `VITE_SUPABASE_*`, `VITE_ADMIN_APP_URL`, `VITE_CLOUDINARY_*`, `VITE_API_URL` | `frontend/.env`, `admin/.env` | Frontend & admin client (`import.meta.env`) |

| `GEMINI_API_KEY`, `RESEND_*`, `ADMIN_*`, `HR_*` | **`backend/.env`** | Netlify functions, `dev:backend`, Vite dev plugins |



### Security rules



| Location | Safe in browser? | Use for |

|----------|------------------|---------|

| Root `.env` — `VITE_*` only | Yes (bundled into the client) | Supabase anon key, Cloudinary preset, admin app URL |

| `backend/.env` — no `VITE_` prefix | No | Gemini, Resend, OpenAI, maps keys, notification emails |



Do **not** put API keys in root `.env` with a `VITE_` prefix. Chat and email go through `/api/chat` and `/api/send-email` using `backend/.env`.



### Netlify env (production)



- **Main site** (frontend + functions): `VITE_*` at **build** time; same server variable names as `backend/.env` for **functions** at runtime.

- **Admin site**: `VITE_*` only (separate Netlify project).



## Netlify



- Main site: `netlify.toml` builds `frontend/dist` and functions from `backend/netlify/functions`.

- Admin: deploy `admin/` as a second Netlify site (build command `npm run build:admin`, publish `admin/dist`).



## SQL



Database setup scripts are in `backend/sql/`.

