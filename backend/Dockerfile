# --- Build Stage ---
FROM haskell:9.6.6 AS builder

# Install system dependencies needed for building (e.g., libpq-dev for postgres)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy configuration files for caching dependencies
COPY stack.yaml package.yaml haskell-servant-realworld.cabal ./

# Build dependencies only (takes time, but will be cached)
RUN stack build --only-dependencies --system-ghc

# Copy the rest of the source code
COPY . .

# Build the production binaries
RUN stack build --system-ghc

# Copy the built binaries to a well-known path
RUN cp $(stack path --local-install-root)/bin/* /app/

# --- Runner Stage ---
FROM ubuntu:22.04 AS runner

# Install runtime dependencies:
# - ca-certificates for secure HTTPS requests (JWT, external APIs, DB SSL)
# - libpq5 for PostgreSQL client library
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy binaries from the builder stage
COPY --from=builder /app/haskell-servant-realworld-exe /app/
COPY --from=builder /app/migrate-exe /app/

# Copy the resource directory containing SQL migrations and seed data
COPY --from=builder /app/resource /app/resource

# Expose the default port
EXPOSE 3000

# Set environment defaults (can be overridden at runtime)
ENV PORT=3000
ENV SHOULD_RUN_MIGRATION_AUTOMATICALLY=true
ENV ALLOW_CORS=true
ENV SHOW_SQL_LOG=true

# Start the server
CMD ["/app/haskell-servant-realworld-exe"]
