#!/bin/bash

# Script to start backend, frontend web, and admin dashboard in new terminal tabs

# 1. Backend: Haskell Servant
gnome-terminal --tab --title="Conduit Backend" --working-directory="/home/rinne/projects/my-package/realworld-fullstack-react-tea-cup-haskell/backend" -- bash -c "direnv exec . make server; exec bash"

# 2. Frontend Web: TEA React Client
gnome-terminal --tab --title="Conduit Frontend" --working-directory="/home/rinne/projects/my-package/realworld-fullstack-react-tea-cup-haskell/frontend-web" -- bash -c "pnpm dev; exec bash"

# 3. Admin Frontend: Sentinel Dashboard TEA React
gnome-terminal --tab --title="Sentinel Dashboard" --working-directory="/home/rinne/projects/my-package/realworld-fullstack-react-tea-cup-haskell/frontend-admin" -- bash -c "pnpm dev; exec bash"

echo "All fullstack servers started in new terminal tabs."
