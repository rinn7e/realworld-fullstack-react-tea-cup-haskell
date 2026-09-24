#!/usr/bin/env bash
set -euo pipefail

# ==============================================================================
# Script: vps-deploy.sh
# Purpose: Deploy the latest image to the VPS (run from your Mac): copies the
#          compose files, pulls the image CI pushed to ghcr.io, applies pending
#          database migrations, and starts/updates the stack, waiting for
#          healthchecks. The database (user data) is never reset.
# Usage:
#   ./scripts/vps-deploy.sh [USER@HOST] [REMOTE_DIR]
#   (USER@HOST defaults to VPS_TARGET in .env)
# ==============================================================================

PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
# Only the VPS_TARGET line is read: the rest of .env is not shell-safe to source
REMOTE_TARGET="${1:-$(sed -n 's/^VPS_TARGET=//p' "$PROJECT_ROOT/.env" 2>/dev/null || true)}"
REMOTE_DIR="${2:-realworld}"

if [ -z "$REMOTE_TARGET" ]; then
  echo "❌ Error: Missing remote VPS SSH target (argument or VPS_TARGET in .env)."
  echo ""
  echo "Usage:"
  echo "  ./scripts/vps-deploy.sh [USER@HOST] [REMOTE_DIR]"
  exit 1
fi

# The VPS .env's COMPOSE_FILE combines both (docker-compose.vps.yml joins the shared proxy)
echo "📦 Copying compose files to $REMOTE_TARGET:$REMOTE_DIR..."
scp "$PROJECT_ROOT/docker-compose.yml" "$PROJECT_ROOT/docker-compose.vps.yml" "$REMOTE_TARGET:$REMOTE_DIR/"

# The token only matters for building the image; the VPS never builds.
# Pulls from ghcr.io occasionally stall forever: 5 min limit per attempt, 3 attempts.
# Migrations run before the new server starts (it refuses to start on an outdated schema).
# Afterwards delete every image no container uses (older deploys), so the disk doesn't fill up.
echo "🚀 Pulling the image, migrating and starting the stack..."
ssh "$REMOTE_TARGET" "cd $(printf '%q' "$REMOTE_DIR") && export INSTALL_GITHUB_PACKAGE_TOKEN=unused \
  && for i in 1 2 3; do timeout 300 docker compose pull --quiet && break; \
       [ \$i = 3 ] && exit 1; echo \"Image pull failed or stalled (attempt \$i/3), retrying...\"; done \
  && docker compose up -d --wait db \
  && docker compose run --rm --no-deps app /app/migrate-exe up \
  && docker compose up -d --wait && docker image prune -af && docker compose ps"

echo "✨ Deployed to $REMOTE_TARGET! 🎉"
