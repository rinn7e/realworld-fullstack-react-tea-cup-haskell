#!/usr/bin/env bash
# Stops the services started by server-ai.sh.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../../../" && pwd)"
PID_DIR="$ROOT_DIR/.pids"

echo "🛑 Stopping RealWorld services..."
if [ -d "$PID_DIR" ]; then
  for pid_file in "$PID_DIR"/*.pid; do
    if [ -f "$pid_file" ]; then
      kill -9 "$(cat "$pid_file")" 2>/dev/null || true
      rm -f "$pid_file"
    fi
  done
fi

# pnpm / stack spawn child processes, so also free the ports directly.
killall -9 haskell-servant-realworld-exe 2>/dev/null || true
lsof -ti:3000 -ti:5173 -ti:5174 -ti:5175 -ti:5176 2>/dev/null | xargs kill -9 2>/dev/null || true

echo "✅ All RealWorld services stopped."
