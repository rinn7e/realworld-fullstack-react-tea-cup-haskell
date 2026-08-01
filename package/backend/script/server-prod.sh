#!/usr/bin/env bash

# Get the root directory of the project
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/../../../" && pwd )"

cd "$PROJECT_ROOT"

# 1. Build frontend-web for production
echo "Building frontend-web..."
(
  cd package/frontend-web
  pnpm install --no-frozen-lockfile
  VITE_BASE_URL=/ VITE_API_BASE=/api pnpm run build
)
rm -rf package/backend/dist/web
mkdir -p package/backend/dist/web
cp -R package/frontend-web/dist/* package/backend/dist/web/

# 2. Build frontend-admin for production
echo "Building frontend-admin..."
(
  cd package/frontend-admin
  pnpm install --no-frozen-lockfile
  VITE_BASE_URL=/admin/ VITE_API_BASE=/api pnpm run build
)
rm -rf package/backend/dist/admin
mkdir -p package/backend/dist/admin
cp -R package/frontend-admin/dist/* package/backend/dist/admin/

# 2.5. Build frontend-admin-legacy for production
echo "Building frontend-admin-legacy..."
(
  cd package/frontend-admin-legacy
  pnpm install --no-frozen-lockfile
  VITE_BASE_URL=/admin-legacy/ VITE_API_BASE=/api pnpm run build
)
rm -rf package/backend/dist/admin-legacy
mkdir -p package/backend/dist/admin-legacy
cp -R package/frontend-admin-legacy/dist/* package/backend/dist/admin-legacy/

# 3. Build showcase-app for production
echo "Building showcase-app..."
(
  cd package/frontend-design-system
  pnpm install --no-frozen-lockfile
  pnpm run build
)
rm -rf package/backend/dist/showcase
mkdir -p package/backend/dist/showcase
cp -R package/frontend-design-system/app/showcase-app/dist/* package/backend/dist/showcase/

# Export env variables pointing to built frontends
export FRONTEND_WEB_DIR="$PROJECT_ROOT/package/frontend-web/dist"
export FRONTEND_ADMIN_DIR="$PROJECT_ROOT/package/frontend-admin/dist"
export FRONTEND_ADMIN_LEGACY_DIR="$PROJECT_ROOT/package/frontend-admin-legacy/dist"
export SHOWCASE_APP_DIR="$PROJECT_ROOT/package/frontend-design-system/app/showcase-app/dist"

# Run backend in production mode directly in this terminal
cd "$PROJECT_ROOT/package/backend"
direnv exec . make server
