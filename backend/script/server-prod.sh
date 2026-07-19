#!/usr/bin/env bash

# Get the root directory of the project
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/../../" && pwd )"

cd "$PROJECT_ROOT"

# 1. Build frontend-web for production
echo "Building frontend-web..."
(
  cd frontend-web
  pnpm install --frozen-lockfile
  VITE_BASE_URL=/ VITE_API_BASE=/api pnpm run build
)
rm -rf backend/dist/web
mkdir -p backend/dist/web
cp -R frontend-web/dist/* backend/dist/web/

# 2. Build frontend-admin for production
echo "Building frontend-admin..."
(
  cd frontend-admin
  pnpm install --frozen-lockfile
  VITE_BASE_URL=/admin/ VITE_API_BASE=/api pnpm run build
)
rm -rf backend/dist/admin
mkdir -p backend/dist/admin
cp -R frontend-admin/dist/* backend/dist/admin/

# Export env variables pointing to built frontends
export FRONTEND_WEB_DIR="$PROJECT_ROOT/frontend-web/dist"
export FRONTEND_ADMIN_DIR="$PROJECT_ROOT/frontend-admin/dist"

# Run backend in production mode directly in this terminal
cd "$PROJECT_ROOT/backend"
direnv exec . make server
