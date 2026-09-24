#!/usr/bin/env bash
set -euo pipefail

# ==============================================================================
# Script: vps-set-env.sh
# Purpose: Set one variable in the VPS .env (run from your Mac) and apply it:
#          replaces the KEY= line (or appends it), leaves every other line
#          untouched, then `docker compose up -d` recreates what changed.
# Usage:
#   ./scripts/vps-set-env.sh KEY VALUE
#   ./scripts/vps-set-env.sh KEY          (prompts; use for values with `$` or spaces)
# Examples:
#   make vps-set-env -- DOMAIN realworld.example.com
#   make vps-set-env -- IMAGE_TAG <commit-sha>     (roll back)
# The VPS is VPS_TARGET from .env (override: VPS_TARGET=root@1.2.3.4 ...),
# its project dir VPS_DIR (default realworld).
# ==============================================================================

PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
# Only the VPS_TARGET line is read: the rest of .env is not shell-safe to source
REMOTE_TARGET="${VPS_TARGET:-$(sed -n 's/^VPS_TARGET=//p' "$PROJECT_ROOT/.env" 2>/dev/null || true)}"
REMOTE_DIR="${VPS_DIR:-realworld}"
REMOTE_ENV="$REMOTE_DIR/.env"

usage() {
  echo "Usage:"
  echo "  ./scripts/vps-set-env.sh KEY [VALUE]   (no VALUE: prompt, for values with \$ or spaces)"
  exit 1
}

if [ -z "$REMOTE_TARGET" ]; then
  echo "❌ Error: Missing remote VPS SSH target (VPS_TARGET in .env)."
  exit 1
fi
if [ $# -lt 1 ] || [ $# -gt 2 ]; then usage; fi

key="$1"
if [[ ! "$key" =~ ^[A-Z_][A-Z0-9_]*$ ]]; then
  echo "❌ '$key' is not a valid variable name (UPPER_SNAKE_CASE)."
  exit 1
fi
if [ "$key" = "POSTGRES_PASSWORD" ]; then
  echo "❌ POSTGRES_PASSWORD can't be changed here: the database keeps the password it was created with."
  exit 1
fi

if [ $# -eq 2 ]; then
  value="$2"
else
  # -r keeps `$` and backslashes exactly as pasted
  read -rp "Value for $key: " value
fi
if [[ "$value" == *"'"* ]]; then
  echo "❌ Values containing a single quote (') are not supported."
  exit 1
fi

# Plain values as-is; anything else single-quoted so compose takes it literally (no `$` expansion)
if [[ "$value" =~ ^[A-Za-z0-9._@:/,+-]*$ ]]; then
  line="$key=$value"
else
  line="$key='$value'"
fi

# -n: ssh must not read the local stdin
if ! current_env=$(ssh -n "$REMOTE_TARGET" "cat $(printf '%q' "$REMOTE_ENV")"); then
  echo "❌ Could not read $REMOTE_TARGET:$REMOTE_ENV. Create it first: make vps-env"
  exit 1
fi

# Replace the KEY= line (append if missing); values come in via ENVIRON so nothing is interpreted
new_env=$(printf '%s\n' "$current_env" | KEY="$key" LINE="$line" awk '
  index($0, ENVIRON["KEY"] "=") == 1 { if (!done) print ENVIRON["LINE"]; done = 1; next }
  { print }
  END { if (!done) print ENVIRON["LINE"] }')

echo "📝 Setting $key in $REMOTE_TARGET:$REMOTE_ENV..."
# Write to a temp file then rename, so a dropped connection can't leave a half-written .env
printf '%s\n' "$new_env" | ssh "$REMOTE_TARGET" \
  "umask 077 && cat > $(printf '%q' "$REMOTE_ENV.tmp") && mv $(printf '%q' "$REMOTE_ENV.tmp") $(printf '%q' "$REMOTE_ENV")"

# Compose recreates only the containers whose config changed
echo "🔄 Applying..."
ssh -n "$REMOTE_TARGET" "cd $(printf '%q' "$REMOTE_DIR") && export INSTALL_GITHUB_PACKAGE_TOKEN=unused \
  && docker compose up -d --wait"

echo "✨ $key updated! 🎉"
