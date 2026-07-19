#!/usr/bin/env bash

# Get the root directory of the project
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/../../" && pwd )"

cd "$PROJECT_ROOT/e2e" && npm run test:e2e:ui
