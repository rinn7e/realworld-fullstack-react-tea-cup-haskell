# syntax=docker/dockerfile:1

# ==============================================================================
# One image: the Haskell server serves the API, swagger, frontend-web (/) and
# frontend-admin (/admin) itself (FRONTEND_WEB_DIR / FRONTEND_ADMIN_DIR).
# Build context: repository root.
# ==============================================================================

# ==============================================================================
# Stage 1: Build frontend-web + frontend-admin
# ==============================================================================
FROM node:22-alpine AS frontend

WORKDIR /app

# Pin pnpm to the version that produced pnpm-lock.yaml
RUN npm install -g pnpm@11.9.0

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY package/frontend-design-system/package.json package/frontend-design-system/.npmrc package/frontend-design-system/
COPY package/frontend-web/package.json package/frontend-web/.npmrc package/frontend-web/
COPY package/frontend-admin/package.json package/frontend-admin/.npmrc package/frontend-admin/

# GitHub Packages token (@rinn7e/tea-cup-*) is passed as a BuildKit secret (id=gh_token)
# so it never lands in an image layer, build arg, or build history. The temporary user
# .npmrc is removed in the same step.
RUN --mount=type=secret,id=gh_token,required=false \
    --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    if [ -s /run/secrets/gh_token ]; then \
      export GITHUB_TOKEN="$(cat /run/secrets/gh_token)"; \
      printf '//npm.pkg.github.com/:_authToken=%s\n@rinn7e:registry=https://npm.pkg.github.com/\n' "$GITHUB_TOKEN" > /root/.npmrc; \
    fi; \
    pnpm --filter tea-cup-realworld --filter tea-cup-realworld-admin --filter @rinn7e/realworld-design-system \
      install --frozen-lockfile; \
    status=$?; \
    rm -f /root/.npmrc; \
    exit $status

COPY package/frontend-design-system package/frontend-design-system
COPY package/frontend-web package/frontend-web
COPY package/frontend-admin package/frontend-admin

# The design-system library first: frontend-web's CSS loads its Tailwind plugin from dist/.
# `vite build` only, its package `build` script would also build the showcase app.
# Env vars override frontend-web/.env.production (same-origin API, served at the root).
RUN pnpm --filter @rinn7e/realworld-design-system exec vite build \
 && VITE_BASE_URL=/ VITE_API_BASE=/api pnpm --filter tea-cup-realworld build \
 && VITE_BASE_URL=/admin/ VITE_API_BASE=/api pnpm --filter tea-cup-realworld-admin build

# ==============================================================================
# Stage 2: Build the Haskell server + migration tool using Stack (GHC 9.8.4 via lts-23.28)
# ==============================================================================
# Base images are pinned by digest: a floating tag changes whenever Debian
# republishes it, which would invalidate every cached layer below (full rebuild).
FROM debian:bookworm-slim@sha256:3783cc01769c7b2b1b83a5c5ad96c815348e28ed7da68e2e3687004faa906251 AS builder

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    ca-certificates \
    curl \
    git \
    gnupg \
    libffi-dev \
    libgmp-dev \
    libncurses-dev \
    libpq-dev \
    netbase \
    pkg-config \
    xz-utils \
    zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

RUN curl -sSL https://get.haskellstack.org/ | sh

# Install GHC + the Hackage index in their own layer, before any project file is
# copied, so dependency changes never re-download GHC.
# Keep GHC_VERSION in sync with the resolver in stack.yaml (lts-23.28 = GHC 9.8.4).
ARG GHC_VERSION=9.8.4
RUN stack setup ${GHC_VERSION} && stack update

# Project-specific system libraries, in their own step AFTER the GHC layer: the steps
# above are a generic "Stack + GHC 9.8.4" base, so other projects using the same steps
# share those cached layers (GHC is the slowest one) on the same machine.
# liblzma-dev: the `lzma` Haskell package needs the xz headers
RUN apt-get update && apt-get install -y --no-install-recommends liblzma-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /build

# Copy configuration and package definition first (Layer Caching)
COPY package/backend/stack.yaml package/backend/stack.yaml.lock package/backend/package.yaml ./

# Compile dependencies into /root/.stack as a regular image layer (not a cache
# mount): CI's type=gha cache only persists layers, so this layer is reused
# across runs until stack.yaml or package.yaml changes.
RUN stack build --only-dependencies \
      haskell-servant-realworld:exe:haskell-servant-realworld-exe \
      haskell-servant-realworld:exe:migrate-exe

# Copy all source code (invalidates only this step when code changes)
COPY package/backend ./

# Compile the server + migration tool and copy binaries to /root/bin
# (no /root/.stack mount here: it would hide the dependency layer above)
RUN --mount=type=cache,target=/build/.stack-work \
    stack build haskell-servant-realworld:exe:haskell-servant-realworld-exe \
      haskell-servant-realworld:exe:migrate-exe \
      --copy-bins \
      --local-bin-path /root/bin

# ==============================================================================
# Stage 3: Minimal runtime image
# ==============================================================================
FROM debian:bookworm-slim@sha256:3783cc01769c7b2b1b83a5c5ad96c815348e28ed7da68e2e3687004faa906251 AS runner

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    ca-certificates \
    curl \
    libffi8 \
    libgmp10 \
    netbase \
    zlib1g \
    && rm -rf /var/lib/apt/lists/*

RUN useradd --system --uid 10001 --no-create-home app

WORKDIR /app

COPY --from=builder /root/bin/haskell-servant-realworld-exe /app/haskell-servant-realworld-exe

# Migration tool (CI deploy job): `/app/migrate-exe up` reads SQL files from
# ./resource/migration relative to WORKDIR (the server reads them too, to check the schema)
COPY --from=builder /root/bin/migrate-exe /app/migrate-exe
COPY package/backend/resource/migration /app/resource/migration

COPY --from=frontend /app/package/frontend-web/dist /app/dist/web
COPY --from=frontend /app/package/frontend-admin/dist /app/dist/admin

USER app

# Shown by GET /api/metadata
ARG GIT_COMMIT_HASH=unknown
ENV GIT_COMMIT_HASH=${GIT_COMMIT_HASH}

EXPOSE 3000
ENV PORT=3000 \
    FRONTEND_WEB_DIR=/app/dist/web \
    FRONTEND_ADMIN_DIR=/app/dist/admin

CMD ["/app/haskell-servant-realworld-exe"]
