#!/bin/bash

# Script to start both backend and admin dashboard frontend in new terminal tabs

# 1. Backend: Haskell Servant
gnome-terminal --tab --title="Conduit Backend" --working-directory="/home/rinne/projects/my-package/my-realworld/haskell-servant-realworld/backend" -- bash -c "direnv exec . make server; exec bash"

# 2. Admin Frontend: Sentinel Dashboard TEA React
gnome-terminal --tab --title="Sentinel Dashboard" --working-directory="/home/rinne/projects/my-package/my-realworld/tea-cup-realworld-admin/frontend" -- bash -c "pnpm dev; exec bash"

echo "Sentinel servers started in new terminal tabs."
