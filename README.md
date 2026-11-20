# Thu Ta Sitt — Portfolio (`thutasitt.dev`)

Dark neo-brutalist engineering portfolio built with Next.js 15 (App Router), TypeScript, and Tailwind CSS v4.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Push to GitHub

```bash
git remote add origin https://github.com/<your-username>/<repo-name>.git
git branch -M main
git push -u origin main
```

## Deploy on a Linux VPS with Docker

```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
docker compose up -d --build
```

- Exposes port `3000` by default (override with `PORT=8080 docker compose up -d --build`).
- Includes a built-in container healthcheck against `/api/status`.
- Put Caddy or Nginx in front of `127.0.0.1:3000` for HTTPS (e.g., Caddy: `thutasitt.dev { reverse_proxy 127.0.0.1:3000 }`).

### Updating on the VPS

```bash
git pull
docker compose up -d --build
```
