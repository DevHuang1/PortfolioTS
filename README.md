# Thu Ta Sitt — Portfolio (`thutasitt.dev`)

Dark neo-brutalist engineering portfolio built with Next.js 15 (App Router, `output: "export"`), TypeScript, Tailwind CSS v4, and an ultra-lightweight **Go static + `/api/status` server** in a `FROM scratch` Docker container.

## Architecture & Resource Footprint

- **Frontend**: Static HTML/CSS/JS exported via `next build` (`output: "export"` -> `out/`), including an interactive mini Chrome-tab browser project sandbox, 15 SSG project case studies, 37 verified certificates, and `/llms.txt`.
- **Production Server (`cmd/server/main.go`)**: Zero-dependency Go binary serving `out/` and live `GET /api/status` (`yangonTime`, `uptimeSeconds`, metadata) inside a `FROM scratch` container (~**6–12 MB RAM** at runtime, ~**50 MB** Docker image).

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deploy on a Linux VPS with Docker + Caddy/Nginx

The container binds strictly to `127.0.0.1:${HOST_PORT:-3010}` (loopback only) so it co-exists cleanly alongside other VPS apps without port conflicts.

```bash
git clone https://github.com/DevHuang1/PortfolioTS.git /opt/portfolio-ts
cd /opt/portfolio-ts
cp .env.example .env
docker compose up -d --build
curl -fsS http://127.0.0.1:3010/api/status
```

### Updating on the VPS

```bash
cd /opt/portfolio-ts && git pull && docker compose up -d --build
```
