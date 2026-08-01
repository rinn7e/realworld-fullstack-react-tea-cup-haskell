#!/usr/bin/env bash

SESSION_NAME="realworld"

# Get the root directory of the project
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/../../../" && pwd )"

cd "$PROJECT_ROOT"

# Kill existing session if it exists
tmux kill-session -t "$SESSION_NAME" 2>/dev/null

# Start new session, detached (-d)
# Enable mouse support
tmux new-session -d -s "$SESSION_NAME" -n "services"
tmux set-option -t "$SESSION_NAME" mouse on

# --- Pane Layout ---
# [ Backend ]      | [ Showcase ]
# [ Web     ]      | [ Admin    ]
#                  | [ Admin Legacy ]

# 1. Top Left: Backend
tmux send-keys -t "$SESSION_NAME" "cd package/backend && direnv exec . make api" C-m

# 2. Split horizontally -> Top Right: Showcase App
tmux split-window -h -t "$SESSION_NAME"
tmux send-keys -t "$SESSION_NAME" "cd package/frontend-design-system && pnpm run showcase:dev" C-m

# 3. Select Top-Left & split vertically -> Bottom Left: Frontend Web
tmux select-pane -t "$SESSION_NAME:0.0"
tmux split-window -v -t "$SESSION_NAME"
tmux send-keys -t "$SESSION_NAME" "cd package/frontend-web && pnpm dev" C-m

# 4. Select Top-Right & split vertically -> Bottom Right: Frontend Admin
tmux select-pane -t "$SESSION_NAME:0.1"
tmux split-window -v -t "$SESSION_NAME"
tmux send-keys -t "$SESSION_NAME" "cd package/frontend-admin && pnpm dev" C-m

# 5. Select Bottom Right & split vertically -> Admin Legacy (port 5176)
tmux select-pane -t "$SESSION_NAME:0.3"
tmux split-window -v -t "$SESSION_NAME"
tmux send-keys -t "$SESSION_NAME" "cd package/frontend-admin-legacy && pnpm dev" C-m

# 6. Enforce equal grid layout
tmux select-layout -t "$SESSION_NAME" tiled

# Attach to the session
tmux attach-session -t "$SESSION_NAME"
