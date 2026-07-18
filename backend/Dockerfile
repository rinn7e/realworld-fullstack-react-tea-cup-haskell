# --- Build Stage ---
FROM --platform=linux/amd64 nixos/nix:latest AS builder

# Enable flakes and disable sandboxing (which fails inside nested Docker VMs)
RUN echo "experimental-features = nix-command flakes" >> /etc/nix/nix.conf && \
    echo "sandbox = false" >> /etc/nix/nix.conf && \
    echo "filter-syscalls = false" >> /etc/nix/nix.conf

WORKDIR /app

# Copy all source files
COPY . .

# Build the Haskell project using Nix Flakes with sandboxing disabled
RUN nix build path:.#default \
    --extra-experimental-features "nix-command flakes" \
    --option sandbox false \
    --option filter-syscalls false

# Extract binaries and resources to a clean path
RUN mkdir -p /app/build && \
    cp -L result/bin/* /app/build/ && \
    cp -r resource /app/build/resource

# --- Runner Stage ---
FROM --platform=linux/amd64 debian:bookworm-slim AS runner

# Install runtime dependencies:
# - ca-certificates for secure HTTPS connections (JWT, DB SSL)
# - libpq-dev and zlib1g-dev for database client libraries
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    libpq-dev \
    zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy binaries and resources from builder
COPY --from=builder /app/build /app

# Expose port
EXPOSE 3000

# Set environment defaults (can be overridden at runtime)
ENV PORT=3000
ENV SHOULD_RUN_MIGRATION_AUTOMATICALLY=true
ENV ALLOW_CORS=true
ENV SHOW_SQL_LOG=true

# Start the server
CMD ["/app/haskell-servant-realworld-exe"]
