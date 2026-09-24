# RealWorld Monorepo Makefile (deployment). Development targets live in package/backend/Makefile.

SHELL := /bin/bash

.PHONY: docker-build docker-up docker-down docker-logs vps-env vps-deploy vps-set-env

# Build the app image locally (tag: IMAGE_TAG from .env, default latest; never pushed)
docker-build:
	docker compose build

# Run the production stack locally on http://localhost:3000
docker-up:
	docker compose up -d --wait

docker-down:
	docker compose down

docker-logs:
	docker compose logs -f

# VPS targets: env -> deploy. The scripts default to VPS_TARGET from .env;
# override with trailing args: make vps-deploy -- root@<ip> [remote-dir]
VPS_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))

vps-env:
	@chmod +x ./scripts/vps-env.sh
	./scripts/vps-env.sh $(VPS_ARGS)

vps-deploy:
	@chmod +x ./scripts/vps-deploy.sh
	./scripts/vps-deploy.sh $(VPS_ARGS)

# Set one variable in the VPS .env and apply it: make vps-set-env -- KEY [VALUE]
vps-set-env:
	@chmod +x ./scripts/vps-set-env.sh
	./scripts/vps-set-env.sh $(VPS_ARGS)

# Turn trailing CLI arguments passed to the VPS targets into dummy rules
ifneq ($(filter vps-env vps-deploy vps-set-env,$(firstword $(MAKECMDGOALS))),)
  $(eval $(VPS_ARGS):;@:)
endif
