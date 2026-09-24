#!/usr/bin/env bash
set -euo pipefail

# ==============================================================================
# Script: vps-env.sh
# Purpose: Create the VPS .env (run from your computer): sets DOMAIN, IMAGE
#          (ghcr.io/<owner>/<repo> from the git remote `origin`), and generates a
#          random POSTGRES_PASSWORD and JWT_SECRET. Refuses to overwrite an existing
#          .env: the Postgres volume keeps the password it was first created
#          with, and a new JWT_SECRET would log every user out.
# Usage:
#   ./scripts/vps-env.sh [USER@HOST] [REMOTE_DIR]
#   DOMAIN=realworld.example.com ./scripts/vps-env.sh   (asks for it when not set)
#   (USER@HOST defaults to VPS_TARGET in .env)
# ==============================================================================

PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
# Only the VPS_TARGET line is read: the rest of .env is not shell-safe to source
REMOTE_TARGET="${1:-$(sed -n 's/^VPS_TARGET=//p' "$PROJECT_ROOT/.env" 2>/dev/null || true)}"
REMOTE_DIR="${2:-realworld}"
DOMAIN="${DOMAIN:-}"

if [ -z "$REMOTE_TARGET" ]; then
  echo "❌ Error: Missing remote VPS SSH target (argument or VPS_TARGET in .env)."
  echo ""
  echo "Usage:"
  echo "  ./scripts/vps-env.sh [USER@HOST] [REMOTE_DIR]"
  exit 1
fi

REMOTE_ENV="$REMOTE_DIR/.env"

if ssh "$REMOTE_TARGET" "test -e $(printf '%q' "$REMOTE_ENV")"; then
  echo "⚠️  $REMOTE_TARGET:$REMOTE_ENV already exists, not touching it."
  echo "   Change single values with: make vps-set-env -- KEY [VALUE]"
  exit 1
fi

if [ -z "$DOMAIN" ]; then
  read -rp "Site address(es) served over HTTPS (e.g. realworld.example.com): " DOMAIN
fi
if [ -z "$DOMAIN" ] || [[ "$DOMAIN" == *"'"* ]]; then
  echo "❌ DOMAIN is empty or contains a single quote."
  exit 1
fi

# Image your fork's CI publishes: ghcr.io/<owner>/<repo> from the `origin` remote (lowercase)
origin=$(git -C "$PROJECT_ROOT" remote get-url origin 2>/dev/null || true)
repo_path=$(printf '%s' "$origin" | sed -E 's#^(git@[^:]+:|https?://[^/]+/)##; s#\.git$##' | tr '[:upper:]' '[:lower:]')
if [[ ! "$repo_path" =~ ^[a-z0-9._-]+/[a-z0-9._-]+$ ]]; then
  echo "❌ Could not read <owner>/<repo> from the git remote 'origin' ($origin)."
  exit 1
fi
image="ghcr.io/$repo_path"

postgres_password=$(openssl rand -hex 24)
jwt_secret=$(openssl rand -hex 32)

echo "📝 Writing $REMOTE_TARGET:$REMOTE_ENV..."
ssh "$REMOTE_TARGET" "umask 077 && mkdir -p $(printf '%q' "$REMOTE_DIR") && cat > $(printf '%q' "$REMOTE_ENV")" <<EOF
# Run behind the droplet's shared HTTPS proxy (docker-compose.vps.yml)
COMPOSE_FILE=docker-compose.yml:docker-compose.vps.yml

# Site address(es) served by the shared proxy
DOMAIN='$DOMAIN'

# Image published by this repository's CI
IMAGE=$image

POSTGRES_PASSWORD=$postgres_password

# Signing key for login tokens (changing it logs every user out)
JWT_SECRET=$jwt_secret
EOF

echo "✨ .env created! Next: make vps-deploy"
