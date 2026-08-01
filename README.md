# RealWorld FullStack Monorepo

A production-grade, type-safe implementation of the RealWorld spec, featuring a Haskell Servant backend and React frontends built with The Elm Architecture (TEA) using `react-tea-cup` and Tailwind CSS v4.

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

## Individual Package Documentation

For details on running individual packages independently:

* [package/backend/README.md](package/backend/README.md)
* [package/frontend-web/README.md](package/frontend-web/README.md)
* [package/frontend-admin/README.md](package/frontend-admin/README.md)
* [package/frontend-admin-legacy/README.md](package/frontend-admin-legacy/README.md)
* [package/frontend-design-system/README.md](package/frontend-design-system/README.md)
* [package/e2e/README.md](package/e2e/README.md)

## License

This project is licensed under the MIT License.
