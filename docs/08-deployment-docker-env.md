# Deployment, Docker, Env, And GitHub Readiness

## Target Production URLs

Frontend:

```text
https://sehti.online
```

Backend:

```text
https://api.sehti.online
```

Database:

```text
PostgreSQL database name: sehti
```

The actual production database URL must be stored only in EasyPanel env variables. Do not commit the real password.

## Required Repo Structure

```text
repo/
  frontend/
    Dockerfile
    .env.example
    package.json
    app/
    components/
    lib/
  backend/
    Dockerfile
    docker-compose.yml
    .env.example
    requirements.txt
    entrypoint.sh
    alembic.ini
    app/
  docs/
```

## Frontend Dockerfile

```dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

Next config must include:

```ts
const nextConfig = {
  output: "standalone",
}

export default nextConfig
```

## Frontend Env Example

Create `frontend/.env.example`:

```env
NEXT_PUBLIC_SITE_URL=https://sehti.online
NEXT_PUBLIC_API_URL=https://api.sehti.online

NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_TIKTOK_PIXEL_ID=

NEXT_PUBLIC_TRACKING_DEBUG=false
```

## Backend Dockerfile

```dockerfile
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
RUN chmod +x /app/entrypoint.sh

EXPOSE 8000
CMD ["/app/entrypoint.sh"]
```

## Backend Entrypoint

Create `backend/entrypoint.sh`:

```sh
#!/bin/sh
set -e

echo "Running database migrations..."
alembic upgrade head

echo "Starting Sehti API..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## Backend Requirements

Create `backend/requirements.txt`:

```txt
fastapi==0.115.6
uvicorn[standard]==0.34.0
sqlalchemy[asyncio]==2.0.36
asyncpg==0.30.0
alembic==1.14.0
pydantic==2.10.4
pydantic-settings==2.7.0
httpx==0.28.1
python-dotenv==1.0.1
```

## Backend Env Example

Create `backend/.env.example`:

```env
APP_ENV=production
APP_NAME=sehti-api
FRONTEND_URL=https://sehti.online
BACKEND_URL=https://api.sehti.online

# EasyPanel internal PostgreSQL URL. Put the real URL only in EasyPanel env.
DATABASE_URL=postgresql+asyncpg://sehti:CHANGE_ME@sehti_database:5432/sehti

GOOGLE_SHEETS_WEBHOOK_URL=

META_PIXEL_ID=
META_ACCESS_TOKEN=
META_TEST_EVENT_CODE=

TIKTOK_PIXEL_CODE=
TIKTOK_ACCESS_TOKEN=
TIKTOK_TEST_EVENT_CODE=

CORS_ORIGINS=https://sehti.online,http://localhost:3000
```

## EasyPanel Setup

### Frontend service
- **GitHub repo:** `https://github.com/wt181761-gif/FRONTEND.git`
- **Branch:** `main`
- **Domain:** `sehti.online` → `http://sehti_frontend:80/`
- **Note:** Easypanel injects `PORT=80` at runtime, Next.js runs on 80 not 3000.

### Backend service
- **GitHub repo:** `https://github.com/wt181761-gif/BACKEND.git`
- **Branch:** `main`
- **Domain:** `api.sehti.online` → `http://sehti_backend:8000/`

### Cloudflare DNS (sehti.online)
- `A` `@` → `187.124.28.208` — Proxied 🟠
- `A` `api` → `187.124.28.208` — Proxied 🟠
- SSL/TLS mode: **Full**
- Do NOT have duplicate A records or Namecheap parking records.

### Important notes
- Frontend runs on **port 80** (Easypanel default), NOT 3000.
- Backend runs on **port 8000**.
- `alembic upgrade head` runs automatically on backend startup via `entrypoint.sh`.
- Backend env vars must include the real `DATABASE_URL` with the actual password, not `CHANGE_ME`.

Database:

- Existing PostgreSQL service.
- DB name: `sehti`.
- User: `sehti`.
- Use internal host in backend env.

## CORS

Backend must allow:

```text
https://sehti.online
http://localhost:3000
```

Never use wildcard `*` in production if sending credentials or user data.

## GitHub Safety

Commit:

- Source code.
- `.env.example`.
- Docs.
- Dockerfiles.
- Migration files.
- Sheet template CSV.
- Google Apps Script template.

Do not commit:

- `.env`
- `.env.local`
- Real `DATABASE_URL`.
- Pixel access tokens.
- Sheet webhook URL if private.

Add `.gitignore`:

```gitignore
.env
.env.local
__pycache__/
.pytest_cache/
node_modules/
.next/
dist/
```

## Launch Checklist

- Frontend builds locally.
- Backend starts locally.
- Alembic migration runs on fresh database.
- `/health` returns `{ "status": "ok" }`.
- Product pages render.
- Add to cart opens drawer.
- Checkout popup validates name and Moroccan phone.
- Upsell appears for 12 seconds.
- Order reaches backend.
- Order reaches Google Sheet.
- Thank-you page shows correct order.
- Meta browser event fires.
- Meta CAPI event fires with same event ID.
- TikTok browser event fires.
- TikTok server event fires with same event ID.
