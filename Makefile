# Makefile meant for running be/fe and other services together

SHELL := /bin/bash

# Compile and run dev-mode services/tabs in Gnome Terminal (staggered startup)
.PHONY: server
server:
	@chmod +x ./my-scripts/server.sh
	./my-scripts/server.sh

.PHONY: server-fresh
server-fresh:
	@chmod +x ./my-scripts/server-fresh.sh
	./my-scripts/server-fresh.sh

.PHONY: test-fe
test-fe:
	cd e2e && npm run test:e2e:ui

.PHONY: lint-fe
lint-fe:
	cd frontend-web && npx eslint --fix . && npx prettier --write .

.PHONY: run-fe
run-fe:
	cd frontend-web && npm run dev

.PHONY: check-fe
check-fe:
	cd frontend-web && npm run check:watch


