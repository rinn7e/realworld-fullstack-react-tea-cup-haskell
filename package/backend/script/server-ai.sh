#!/usr/bin/env bash
# Starts all services in the background without tmux (for AI agents / non-interactive shells).
# Logs go to logs/, pids to .pids/ at the project root. Stop with: make server-stop-ai
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../../../" && pwd)"
cd "$ROOT_DIR"

PID_DIR="$ROOT_DIR/.pids"
LOG_DIR="$ROOT_DIR/logs"
mkdir -p "$PID_DIR" "$LOG_DIR"

echo "🛑 Stopping any previously running RealWorld services..."
tmux kill-session -t realworld 2>/dev/null || true
"$SCRIPT_DIR/stop-server-ai.sh" >/dev/null

echo "🔨 Building the Haskell backend..."
(cd package/backend && direnv exec . stack build --fast)

# Each service's whole subshell is redirected to its log, so nothing keeps this script's
# stdout open after it exits.
start() {
  local name="$1" dir="$2"
  shift 2
  (cd "$dir" && exec "$@") >> "$LOG_DIR/$name.log" 2>&1 &
  echo $! > "$PID_DIR/$name.pid"
}

echo "🚀 Starting services without tmux..."
echo "   ▶ [1/5] Backend API (port 3000)"
start backend package/backend direnv exec . stack exec haskell-servant-realworld-exe
echo "   ▶ [2/5] Frontend Web (port 5173)"
start frontend-web package/frontend-web pnpm dev
echo "   ▶ [3/5] Frontend Admin (port 5174)"
start frontend-admin package/frontend-admin pnpm dev
echo "   ▶ [4/5] Design System Showcase (port 5175)"
start showcase package/frontend-design-system pnpm run showcase:dev
echo "   ▶ [5/5] Frontend Admin Legacy (port 5176)"
start frontend-admin-legacy package/frontend-admin-legacy pnpm dev

# Wait for every service to accept connections ("localhost", not 127.0.0.1: Vite may bind to
# the IPv6 ::1 only)
for i in {1..60}; do
  if nc -z localhost 3000 && nc -z localhost 5173 && nc -z localhost 5174 \
    && nc -z localhost 5175 && nc -z localhost 5176; then
    break
  fi
  sleep 0.5
done 2>/dev/null

echo ""
echo "✨ All RealWorld services are running in background!"
echo "📂 Live log files: $LOG_DIR/{backend,frontend-web,frontend-admin,showcase,frontend-admin-legacy}.log"
echo ""
echo "🌐 Backend API:  http://localhost:3000"
echo "🌐 Web:          http://localhost:5173"
echo "🌐 Admin:        http://localhost:5174"
echo "🌐 Showcase:     http://localhost:5175"
echo "🌐 Admin Legacy: http://localhost:5176"
echo "🛑 Stop with: make server-stop-ai"
