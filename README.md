# RealWorld FullStack Monorepo

A production-grade, type-safe implementation of the RealWorld spec, featuring a Haskell Servant backend and React frontends built with The Elm Architecture (TEA) using `react-tea-cup` and Tailwind CSS v4.

**Live demo:** [https://conduit.rinn7e.com/](https://conduit.rinn7e.com/). It also has an admin dashboard at [`/admin/`](https://conduit.rinn7e.com/admin/) and API docs at [`/swagger-ui`](https://conduit.rinn7e.com/swagger-ui/).

## Project Structure

* [**package/backend/**](package/backend) — Haskell Servant Conduit API with PostgreSQL, Persistent, and Esqueleto.
* [**package/frontend-web/**](package/frontend-web) — React 19 RealWorld web application built with `react-tea-cup` (Port 5173).
* [**package/frontend-admin/**](package/frontend-admin) — Sentinel Dashboard for system monitoring and cache management (Port 5174).
* [**package/frontend-admin-legacy/**](package/frontend-admin-legacy) — Sentinel Dashboard Legacy backup (Port 5176).
* [**package/frontend-design-system/**](package/frontend-design-system) — Design system component library built with Tailwind CSS v4 `@plugin` and TEA.
* [**package/e2e/**](package/e2e) — Playwright E2E integration test suite for `frontend-web`.

## Quick Start (Run All Services)

Launch all services simultaneously in a tmux session:

```bash
# Start all 5 services (Backend, Showcase, Web, Admin, Admin Legacy) in tmux
cd package/backend && make server

# Or start with a fresh database reset:
cd package/backend && make server-fresh
```

### Services Overview:

| Service | Location | Port / URL |
|---|---|---|
| **Backend API** | `package/backend` | `http://localhost:3000` |
| **Frontend Web** | `package/frontend-web` | `http://localhost:5173` |
| **Frontend Admin** | `package/frontend-admin` | `http://localhost:5174` |
| **Design System Showcase** | `package/frontend-design-system/app/showcase-app` | `http://localhost:5175` |
| **Frontend Admin Legacy** | `package/frontend-admin-legacy` | `http://localhost:5176` |

## Deployment (Docker + GitHub Actions + VPS)

Live demo: [https://conduit.rinn7e.com/](https://conduit.rinn7e.com/). The site at `/` is the web app, `/admin/` is the admin dashboard, and `/swagger-ui` has the API docs.

This section explains how to run the production image locally and how to deploy your own copy to a Linux server with automatic HTTPS and CI/CD.

### How it works

```
git push master ─▶ GitHub Actions (.github/workflows/deploy.yml)
                     1. build ONE image (docker/app.Dockerfile): Haskell server + frontend-web + frontend-admin
                        → ghcr.io/<owner>/<repo>:latest and :<commit-sha>
                     2. deploy over SSH: pull on the server → migrate-exe up → docker compose up --wait
server ─ caddy-front (HTTPS :443, github.com/rinn7e/caddy-front)
           └─ docker network "proxy" ─▶ app :3000 (serves /, /admin, /api, /swagger-ui) ─▶ db (Postgres 18, volume)
```

- **One image.** The Haskell server serves both frontends itself (`FRONTEND_WEB_DIR`, `FRONTEND_ADMIN_DIR`), next to `/api` and the swagger UIs.
- **HTTPS is handled elsewhere.** It's not part of this repo: [caddy-front](https://github.com/rinn7e/caddy-front), a small shared reverse proxy, owns port 443 and the certificates, so several projects can share one server. This project only joins its `proxy` network and registers `DOMAIN` with labels, in [`docker-compose.vps.yml`](docker-compose.vps.yml).
- **The database holds user data.** Deploys only run pending migrations. They never reset or reseed it. Back it up with `pg_dump` (see `package/backend/README.md`).
- **Compose files:**
  - [`docker-compose.yml`](docker-compose.yml) is the app and database, with no ports published.
  - [`docker-compose.override.yml`](docker-compose.override.yml) is for local use and loaded automatically. It serves `http://localhost:3000`.
  - `docker-compose.vps.yml` is for the server only. It's enabled by `COMPOSE_FILE=docker-compose.yml:docker-compose.vps.yml` in the server's `.env`.
- **`@rinn7e/tea-cup-*` packages come from GitHub Packages.** Its npm registry requires a login even for public packages, so create a GitHub personal access token (classic) with the `read:packages` scope and export it as `INSTALL_GITHUB_PACKAGE_TOKEN` in your shell.

### Run the production stack locally

Requirements: Docker, plus `INSTALL_GITHUB_PACKAGE_TOKEN` in your shell.

```bash
cp .env.example .env                        # then add IMAGE_TAG=localtest
docker compose build                        # builds ghcr.io/...:localtest (never pushed)
docker compose up -d --wait db
docker compose run --rm app /app/migrate-exe up
docker compose up -d --wait                 # http://localhost:3000 and http://localhost:3000/admin/
```

To load the demo data (users, articles; every password is `testtest`) into the fresh database:

```bash
docker compose exec -T db psql -U postgres -d realworld < package/backend/resource/seed.sql
```

### Deploy your own copy

**You need:**
- **A fork of this repository.** Its CI publishes the image to `ghcr.io/<your-account>/<repo>`.
- **An x86_64 Linux server with a public IP.** 1 GB RAM plus swap is enough.
- **A domain name.** One A record for the site, e.g. `realworld.example.com`.

**1. Prepare the server (once).** Follow [caddy-front](https://github.com/rinn7e/caddy-front): its README sets up swap, the firewall (SSH + 443) and Docker, then starts the proxy. Then let the server pull your private image:

```bash
ssh root@<server-ip> docker login ghcr.io -u <github-username>    # password: a PAT with read:packages
```

**2. DNS.** Add an `A` record for your domain pointing at the server IP. On Cloudflare, set it to **DNS only** (grey cloud).

**3. Create the server `.env`** (from your computer, in this repo):

```bash
echo "VPS_TARGET=root@<server-ip>" >> .env
make vps-env        # asks for DOMAIN; sets IMAGE from your git remote; generates POSTGRES_PASSWORD, JWT_SECRET
```

`make vps-env` refuses to overwrite an existing `.env`, because the database keeps the password it was created with. To change one value later, use `make vps-set-env -- KEY [VALUE]`.

**4. Let GitHub Actions deploy over SSH.** Use a dedicated key, so your personal key never goes to GitHub:

```bash
ssh-keygen -t ed25519 -N "" -C "github-actions-deploy" -f ~/.ssh/realworld_deploy
# -f is required: without it ssh-copy-id test-logs in with your personal key and skips this one
ssh-copy-id -f -i ~/.ssh/realworld_deploy.pub root@<server-ip>

gh secret set VPS_SSH_KEY < ~/.ssh/realworld_deploy
ssh-keyscan <server-ip> | gh secret set VPS_KNOWN_HOSTS    # pins the server's host key
gh secret set VPS_HOST --body <server-ip>
gh secret set VPS_USER --body root
gh secret set VPS_DIR --body realworld                     # folder on the server (~/realworld)
gh secret set INSTALL_GITHUB_PACKAGE_TOKEN                 # the read:packages PAT, for the @rinn7e/tea-cup-* install
```

**5. Deploy.** Push to `master`, or run *Build & Publish Docker Image* from the Actions tab. CI builds the image, pushes it, runs migrations on the server and starts the app. Only pushes that change the app trigger it (see `paths:` in the workflow), and a weekly run keeps the build cache warm without deploying.

**6. (Optional) Load the demo data once**, into the still-empty database:

```bash
ssh root@<server-ip> 'cd realworld && docker compose exec -T db psql -U postgres -d realworld' < package/backend/resource/seed.sql
```

### Day to day

| Command | What it does |
| :--- | :--- |
| `make vps-deploy` | Manual deploy of `:latest`: copy the compose files, pull, migrate, restart |
| `make vps-set-env -- KEY [VALUE]` | Change one value in the server `.env` and apply it. With no `VALUE` it prompts, which you need for values with `$` or spaces |
| `make vps-set-env -- IMAGE_TAG <old-sha>` | Roll back to an older commit's image (the next push deploys its own commit again) |
| `make docker-up` / `make docker-down` | Start / stop the production stack locally |

All `make vps-*` commands use `VPS_TARGET` from your local `.env`. Override it with `make vps-deploy -- root@<other-ip>`.

## Individual Package Documentation

For details on running individual packages independently:

* [package/backend/README.md](package/backend/README.md)
* [package/frontend-web/README.md](package/frontend-web/README.md)
* [package/frontend-admin/README.md](package/frontend-admin/README.md)
* [package/frontend-admin-legacy/README.md](package/frontend-admin-legacy/README.md)
* [package/frontend-design-system/README.md](package/frontend-design-system/README.md)
* [package/e2e/README.md](package/e2e/README.md)

## Sponsors

A heartfelt thank you to the sponsors supporting this project 😁:

* [@0x000000000000000000001](https://github.com/0x000000000000000000001)

## License

This project is licensed under the MIT License.
