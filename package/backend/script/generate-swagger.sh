#!/usr/bin/env bash
set -euo pipefail

# Find backend directory relative to script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$BACKEND_DIR"

TYPE="${1:-}"

if [ "$TYPE" = "web" ]; then
  echo "Generating swagger-web.yaml..."
  stack repl haskell-servant-realworld:lib --package yaml --ghci-options='-e "import Infrastructure.Api.Route.OpenApi (openApiSpec)" -e "import Data.Yaml qualified as Y" -e "import Data.ByteString.Char8 qualified as BS" -e "BS.writeFile \"swagger-web.yaml\" (Y.encode openApiSpec)"'
  echo "Generated swagger-web.yaml successfully!"
elif [ "$TYPE" = "admin" ]; then
  echo "Generating swagger-admin.yaml..."
  stack repl haskell-servant-realworld:lib --package yaml --ghci-options='-e "import Infrastructure.Api.Route.OpenApi (adminOpenApiSpec)" -e "import Data.Yaml qualified as Y" -e "import Data.ByteString.Char8 qualified as BS" -e "BS.writeFile \"swagger-admin.yaml\" (Y.encode adminOpenApiSpec)"'
  echo "Generated swagger-admin.yaml successfully!"
else
  echo "Error: Please specify 'web' or 'admin'"
  exit 1
fi
