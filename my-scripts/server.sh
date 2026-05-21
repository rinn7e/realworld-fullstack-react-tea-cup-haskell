#!/bin/bash

# Script to start backend, frontend web, and admin dashboard in new terminal tabs

ROOT_DIR="/home/rinne/projects/my-package/realworld-fullstack-react-tea-cup-haskell"

# Open 1 window with 3 tabs: backend, frontend-web, frontend-admin
gnome-terminal \
  --tab --title="Conduit Backend"    -- bash -c "cd '$ROOT_DIR'        && ./my-scripts/core/server.sh"
