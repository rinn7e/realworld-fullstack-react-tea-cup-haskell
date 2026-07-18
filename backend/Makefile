.PHONY: build watch server server-watch resetdb seed migrate-generate migrate-up migrate-up-one migrate-down-one migrate-status lint format build-haddock build-hoogle hoogle test compile install exec run-installed swagger-web swagger-admin

# Build with fast compilation
build:
	cabal build

# Generate Web OpenAPI 3.0 specification in YAML format
swagger-web:
	cabal repl haskell-servant-realworld:lib --build-depends=yaml --ghc-options="-e \"import Infrastructure.Api.Route.OpenApi (openApiSpec)\" -e \"import Data.Yaml qualified as Y\" -e \"import Data.ByteString.Char8 qualified as BS\" -e \"BS.writeFile \\\"swagger-web.yaml\\\" (Y.encode openApiSpec)\""
	@echo "Generated swagger-web.yaml successfully!"

# Generate Admin OpenAPI 3.0 specification in YAML format
swagger-admin:
	cabal repl haskell-servant-realworld:lib --build-depends=yaml --ghc-options="-e \"import Infrastructure.Api.Route.OpenApi (adminOpenApiSpec)\" -e \"import Data.Yaml qualified as Y\" -e \"import Data.ByteString.Char8 qualified as BS\" -e \"BS.writeFile \\\"swagger-admin.yaml\\\" (Y.encode adminOpenApiSpec)\""
	@echo "Generated swagger-admin.yaml successfully!"



# Build and watch for changes
watch:
	cabal build --file-watch

# Build and run the server
server:
	cabal run haskell-servant-realworld-exe

# Build, watch, and auto-restart the server
server-watch:
	cabal run haskell-servant-realworld-exe --file-watch

# Reset database and start dev server
server-fresh:
	./script/resetdb.sh
	$(MAKE) migrate-up
	$(MAKE) seed
	$(MAKE) server

# Reset database and start dev server
resetdb:
	./script/resetdb.sh

# Populate database with seed data
seed:
	psql "$$DB_CONN" -f resource/seed.sql

# Generate a new migration (Usage: make migrate-generate NAME=add_users)
migrate-generate:
	@if [ -z "$(NAME)" ]; then echo "Error: NAME is required. Usage: make migrate-generate NAME=some_name"; exit 1; fi
	cabal run migrate-exe -- generate $(NAME)

# Run all pending up migrations
migrate-up:
	cabal run migrate-exe -- up

# Run a single pending up migration
migrate-up-one:
	cabal run migrate-exe -- up-one

# Run a single down migration
migrate-down-one:
	cabal run migrate-exe -- down-one

# Check migration status and schema mismatches
migrate-status:
	cabal run migrate-exe -- status

# Lint Haskell code
lint:
	hlint src app

# # Lint and fix right away
# lint-fix:
# 	@echo "Applying hlint automatic refactoring..."
# 	find src app test -name "*.hs" | xargs -I {} hlint --refactor --refactor-options="-i" {}

# Format Haskell code
format:
	find src app test -name "*.hs" | xargs fourmolu --mode inplace

# Generate documentation
build-haddock:
	cabal haddock

# Start local Hoogle server
build-hoogle:
# generate Haddock docs for all your packages
	$(MAKE) haddock
# generate the Hoogle index
	stack hoogle -- generate --local --database=.stack-work/hoogle
# perform a search for map
	stack hoogle -- map --database=.stack-work/hoogle
# start a server
	stack hoogle -- server --local --database=.stack-work/hoogle

# Start local Hoogle server
hoogle:
	stack hoogle -- server --local --database=.stack-work/hoogle

# Run tests
test:
	cabal test

# Compile binary (production build)
compile:
	cabal build --enable-optimization

# Install binary to ~/.local/bin
install:
	cabal install

# Run the compiled binary via stack
exec:
	cabal run haskell-servant-realworld-exe

# Run the installed binary (assumes ~/.local/bin is in PATH)
run-installed:
	haskell-servant-realworld-exe
