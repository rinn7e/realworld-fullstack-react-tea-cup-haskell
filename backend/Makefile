.DEFAULT_GOAL := build

.PHONY: build watch server server-watch resetdb seed migrate-generate migrate-up migrate-up-one migrate-down-one migrate-status lint format build-haddock build-hoogle hoogle test compile install exec run-installed swagger-web swagger-admin server-fresh server-prod docker deploy docker-dry-run

# Build with fast compilation
build:
	nix develop -c cabal build

# Generate Web OpenAPI 3.0 specification in YAML format
swagger-web:
	@chmod +x ./script/generate-swagger.sh
	nix develop -c "./script/generate-swagger.sh web"

# Generate Admin OpenAPI 3.0 specification in YAML format
swagger-admin:
	@chmod +x ./script/generate-swagger.sh
	nix develop -c "./script/generate-swagger.sh admin"

# Build and watch for changes
watch:
	nix develop -c "cabal build --file-watch"

# Build and run the server
server:
	nix develop -c cabal run haskell-servant-realworld-exe

# Build, watch, and auto-restart the server
server-watch:
	nix develop -c "cabal run haskell-servant-realworld-exe --file-watch"

# Reset database and start dev server
server-fresh:
	nix develop -c ./script/resetdb.sh
	$(MAKE) migrate-up
	$(MAKE) seed
	$(MAKE) server

# Compile frontends and run server in production mode
server-prod:
	@chmod +x ./script/server-prod.sh
	nix develop -c ./script/server-prod.sh

# Build production docker image entirely inside backend context (compiles frontends on host)
docker:
	# Compile frontends on host using pnpm
	cd ../frontend-web && VITE_BASE_URL=/ VITE_API_BASE=/api pnpm run build
	cd ../frontend-admin && VITE_BASE_URL=/admin/ VITE_API_BASE=/api pnpm run build
	# Copy compiled outputs into backend/dist/
	rm -rf dist/web dist/admin
	mkdir -p dist/web dist/admin
	cp -R ../frontend-web/dist/* dist/web/
	cp -R ../frontend-admin/dist/* dist/admin/
	# Run docker build with backend/ as context and pass the Cachix auth token securely
	docker build --secret id=CACHIX_AUTH_TOKEN,env=CACHIX_AUTH_TOKEN --platform linux/amd64 -t rinn7e-haskell-realworld-api .
	# Clean up compiled folders from host backend/dist/
	rm -rf dist/web dist/admin

# Deploy to Fly.io using the locally built Docker image
deploy:
	fly deploy --image rinn7e-haskell-realworld-api --local-only

# Run a dry-run of the Docker build to see what Nix will fetch vs build
docker-dry-run:
	docker build --secret id=CACHIX_AUTH_TOKEN,env=CACHIX_AUTH_TOKEN --platform linux/amd64 -f Dockerfile.dry .

# Reset database and start dev server
resetdb:
	nix develop -c ./script/resetdb.sh

# Populate database with seed data
seed:
	nix develop -c "psql \"\$$DB_CONN\" -f resource/seed.sql"

# Generate a new migration (Usage: make migrate-generate NAME=add_users)
migrate-generate:
	@if [ -z "$(NAME)" ]; then echo "Error: NAME is required. Usage: make migrate-generate NAME=some_name"; exit 1; fi
	nix develop -c "cabal run migrate-exe -- generate $(NAME)"

# Run all pending up migrations
migrate-up:
	nix develop -c "cabal run migrate-exe -- up"

# Run a single pending up migration
migrate-up-one:
	nix develop -c "cabal run migrate-exe -- up-one"

# Run a single down migration
migrate-down-one:
	nix develop -c "cabal run migrate-exe -- down-one"

# Check migration status and schema mismatches
migrate-status:
	nix develop -c "cabal run migrate-exe -- status"

# Lint Haskell code
lint:
	nix develop -c "hlint src app"

# Format Haskell code
format:
	nix develop -c "find src app test -name '*.hs' | xargs fourmolu --mode inplace"

# Generate documentation
build-haddock:
	nix develop -c cabal haddock

# Start local Hoogle server
build-hoogle:
	$(MAKE) build-haddock
	nix develop -c "stack hoogle -- generate --local --database=.stack-work/hoogle"
	nix develop -c "stack hoogle -- map --database=.stack-work/hoogle"
	nix develop -c "stack hoogle -- server --local --database=.stack-work/hoogle"

# Start local Hoogle server
hoogle:
	nix develop -c "stack hoogle -- server --local --database=.stack-work/hoogle"

# Run tests
test:
	nix develop -c cabal test

# Compile binary (production build)
compile:
	nix develop -c "cabal build --enable-optimization"

# Install binary to ~/.local/bin
install:
	nix develop -c cabal install

# Run the compiled binary via stack
exec:
	nix develop -c cabal run haskell-servant-realworld-exe

# Run the installed binary (assumes ~/.local/bin is in PATH)
run-installed:
	nix develop -c haskell-servant-realworld-exe
