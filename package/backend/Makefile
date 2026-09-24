.DEFAULT_GOAL := build

.PHONY: build watch api api-watch server resetdb seed migrate-generate migrate-up migrate-up-one migrate-down-one migrate-status lint format build-haddock build-hoogle hoogle test compile install exec run-installed swagger-web swagger-admin server-fresh server-prod

# Build with fast compilation
build:
	stack build --fast

# Generate Web OpenAPI 3.0 specification in YAML format
swagger-web:
	@chmod +x ./script/generate-swagger.sh
	./script/generate-swagger.sh web

# Generate Admin OpenAPI 3.0 specification in YAML format
swagger-admin:
	@chmod +x ./script/generate-swagger.sh
	./script/generate-swagger.sh admin

# Build and watch for changes
watch:
	stack build --fast --file-watch

# Build and run the API
api:
	stack build --fast && stack exec haskell-servant-realworld-exe

# Build, watch, and re-run the API after every successful build
api-watch:
	stack build --fast --file-watch --exec haskell-servant-realworld-exe

# Run API, Frontend Web, and Frontend Admin in tmux windows
server:
	@chmod +x ./script/server.sh
	./script/server.sh

# Reset database and start dev server
server-fresh:
	./script/resetdb.sh
	$(MAKE) migrate-up
	$(MAKE) seed
	$(MAKE) server

# Compile frontends and run server in production mode
server-prod:
	@chmod +x ./script/server-prod.sh
	./script/server-prod.sh

# Reset database
resetdb:
	@chmod +x ./script/resetdb.sh
	./script/resetdb.sh

# Populate database with seed data
seed:
	psql "$${DB_CONN:-host=localhost dbname=realworld user=postgres password=postgres port=5432}" -f resource/seed.sql

# Generate a new migration (Usage: make migrate-generate NAME=add_users)
migrate-generate:
	@if [ -z "$(NAME)" ]; then echo "Error: NAME is required. Usage: make migrate-generate NAME=some_name"; exit 1; fi
	stack build --fast && stack exec migrate-exe -- generate $(NAME)

# Run all pending up migrations
migrate-up:
	stack build --fast && stack exec migrate-exe -- up

# Run a single pending up migration
migrate-up-one:
	stack build --fast && stack exec migrate-exe -- up-one

# Run a single down migration
migrate-down-one:
	stack build --fast && stack exec migrate-exe -- down-one

# Check migration status and schema mismatches
migrate-status:
	stack build --fast && stack exec migrate-exe -- status

# Lint Haskell code
lint:
	hlint src app

# Format Haskell code
format:
	find src app test -name '*.hs' | xargs fourmolu --mode inplace

# Generate documentation
build-haddock:
	stack haddock --fast

# Generate and start local Hoogle server
build-hoogle:
	stack hoogle -- generate --local
	stack hoogle -- server --local

# Start local Hoogle server
hoogle:
	stack hoogle -- server --local

# Run tests
test:
	stack test --fast

# Compile binary (production build)
compile:
	stack build

# Install binary to ~/.local/bin
install:
	stack install

# Run the compiled binary via stack
exec:
	stack exec haskell-servant-realworld-exe

# Run the installed binary (assumes ~/.local/bin is in PATH)
run-installed:
	haskell-servant-realworld-exe
