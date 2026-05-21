#!/bin/bash

concurrently \
  --names "BACKEND,WEB,ADMIN" \
  --prefix-colors "blue,green,magenta" \
  --kill-others \
  "cd backend && direnv exec . make server" \
  "cd frontend-web && pnpm dev" \
  "cd frontend-admin && pnpm dev"
