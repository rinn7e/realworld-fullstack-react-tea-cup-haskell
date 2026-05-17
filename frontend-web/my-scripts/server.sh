#!/bin/bash

# Script to start both backend and frontend in new terminal tabs

# 1. Backend: Haskell Servant
gnome-terminal --tab --title="Conduit Backend" --working-directory="/home/rinne/projects/my-package/my-realworld/haskell-servant-realworld/backend" -- bash -c "direnv exec . make server; exec bash"

# 2. Frontend: TEA React
gnome-terminal --tab --title="Conduit Frontend" --working-directory="/home/rinne/projects/my-package/my-realworld/tea-cup-realworld/frontend" -- bash -c "pnpm dev; exec bash"

echo "Servers started in new terminal tabs."
