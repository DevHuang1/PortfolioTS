# Thu Ta Sitt — Portfolio (`thutasitt.dev`)

Dark neo-brutalist engineering portfolio built with Next.js 15 (App Router, `output: "standalone"`), TypeScript, and Tailwind CSS v4.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deploy on a z.com Linux VPS Alongside Another Project (Docker + Nginx)

The container binds strictly to `127.0.0.1:${HOST_PORT:-3010}` (loopback only) so it will not conflict with an existing project on port `3000`, `80`, or `443`.

### 1. Check ports & DNS before deploying

- Point an **A record** for your domain or subdomain (e.g. `thutasitt.dev` or `portfolio.yourdomain.com`) to your z.com VPS public IP.
- On the VPS, confirm `3010` is free alongside your other project:

```bash
ss -tulpn | grep -E ':3010\b'
```

### 2. Clone & start the portfolio container

```bash
sudo mkdir -p /opt/portfolio-ts && sudo chown "$USER":"$USER" /opt/portfolio-ts
git clone https://github.com/DevHuang1/PortfolioTS.git /opt/portfolio-ts
cd /opt/portfolio-ts

cp .env.example .env
# Edit .env and set NEXT_PUBLIC_SITE_URL=https://your-domain-or-subdomain (and HOST_PORT if 3010 is busy)
nano .env

docker compose up -d --build
```

Verify the container is healthy on localhost without exposing port `3010` publicly:

```bash
docker compose ps
curl -fsS http://127.0.0.1:3010/api/status
```

### 3. Add isolated Nginx reverse proxy & HTTPS (keeps existing project untouched)

```bash
sudo cp deploy/nginx/portfolio.conf /etc/nginx/sites-available/portfolio.conf
# Edit server_name (and 3010 if you changed HOST_PORT)
sudo nano /etc/nginx/sites-available/portfolio.conf

sudo ln -s /etc/nginx/sites-available/portfolio.conf /etc/nginx/sites-enabled/portfolio.conf
sudo nginx -t
sudo systemctl reload nginx

# Enable Let's Encrypt HTTPS for this domain/subdomain
sudo certbot --nginx -d your-domain-or-subdomain
```

> Note: `deploy/nginx/portfolio.conf` sets `X-Frame-Options: SAMEORIGIN` so the in-page PDF certificate modal (`<iframe>`) continues working over HTTPS.

### 4. Update with zero impact to your other project

```bash
cd /opt/portfolio-ts
git pull
docker compose up -d --build
```
