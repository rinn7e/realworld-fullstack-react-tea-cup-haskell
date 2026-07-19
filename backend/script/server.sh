#!/usr/bin/env bash

SESSION_NAME="realworld"

# Get the root directory of the project
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/../../" && pwd )"

cd "$PROJECT_ROOT"

# Kill existing session if it exists
tmux kill-session -t "$SESSION_NAME" 2>/dev/null

# Start new session, detached (-d)
# Enable mouse support
tmux new-session -d -s "$SESSION_NAME" -n "services"
tmux set-option -t "$SESSION_NAME" mouse on

# --- Pane Layout ---
# [----- Pane 0: Backend (Top) -----]
# [ Pane 1: Web ] | [ Pane 2: Admin ]

# Pane 0: Backend [Top]
tmux send-keys -t "$SESSION_NAME" "cd backend && direnv exec . make server" C-m

# Pane 1: Frontend Web [Bottom Left]
tmux split-window -v -t "$SESSION_NAME"
tmux send-keys -t "$SESSION_NAME" "cd frontend-web && pnpm dev" C-m

# Pane 2: Frontend Admin [Bottom Right]
tmux split-window -h -t "$SESSION_NAME"
tmux send-keys -t "$SESSION_NAME" "cd frontend-admin && pnpm dev" C-m

# Attach to the session
tmux attach-session -t "$SESSION_NAME"
