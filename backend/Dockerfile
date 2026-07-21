# syntax=docker/dockerfile:1
# check=skip=FromPlatformFlagConstDisallowed
# --- Build Stage ---
FROM --platform=linux/amd64 nixos/nix:latest AS builder

# Enable flakes and disable sandboxing
RUN echo "experimental-features = nix-command flakes" >> /etc/nix/nix.conf && \
    echo "sandbox = false" >> /etc/nix/nix.conf && \
    echo "filter-syscalls = false" >> /etc/nix/nix.conf && \
    echo "substituters = https://cache.nixos.org https://cache.iog.io" >> /etc/nix/nix.conf && \
    echo "trusted-public-keys = cache.nixos.org-1:6NCHdD59X431o0gWypbMrAURkbJ16ZPMQFGspcDShjY= hydra.iohk.io:f/Ea+s+dFdN+3Y/G+FDgSq+a5NEWhJGzdjvKNGv0/EQ=" >> /etc/nix/nix.conf

WORKDIR /app

# Copy ONLY the configuration files first to cache dependencies.
# We use --link and exclude the .cabal file to prevent local code changes or
# auto-generated cabal updates from invalidating the GHC download cache.
COPY --link flake.nix flake.lock cabal.project package.yaml stack.yaml stack.yaml.lock ./

# Fetch and build all dependencies in the GHC environment, caching this Docker layer.
# We save it as a persistent profile so GHC and dependencies are cached in the /nix/store.
# We target the lean .#build shell to exclude massive editor/formatting tools.
RUN nix develop .#build \
    --extra-experimental-features "nix-command flakes" \
    --option sandbox false \
    --option filter-syscalls false \
    --profile /app/dev-profile --command true

# Now copy the rest of the source code
COPY --link . .

# Build the Haskell project (reusing GHC and libraries from the cached Docker layer!)
RUN nix build path:.#default \
    --extra-experimental-features "nix-command flakes" \
    --option sandbox false \
    --option filter-syscalls false

# Extract binaries to a clean folder and archive the closure.
# We remove the '-h' (dereference) flag from tar to prevent infinite recursion on symlinks,
# which caused the segmentation fault (exit code 139) under emulation.
RUN mkdir -p /app/bin && \
    cp -L result/bin/* /app/bin/ && \
    tar -cf /app/closure.tar $(nix-store -qR result)

# --- Runner Stage ---
FROM --platform=linux/amd64 debian:bookworm-slim AS runner

# Install CA certificates (required for secure Supabase TLS/SSL connections)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy and extract the runtime closure from builder to /nix/store
COPY --link --from=builder /app/closure.tar /
RUN tar -xf /closure.tar -C / && rm /closure.tar

# Copy the compiled binaries and migration resources directly
COPY --link --from=builder /app/bin /app/bin
COPY --link --from=builder /app/resource /app/resource

# Copy static frontend assets (pre-compiled on host)
COPY --link dist/web /app/frontend-web/dist
COPY --link dist/admin /app/frontend-admin/dist

# Expose port
EXPOSE 3000

# Set environment defaults (can be overridden at runtime)
ENV PORT=3000
ENV SHOULD_RUN_MIGRATION_AUTOMATICALLY=true
ENV ALLOW_CORS=true
ENV SHOW_SQL_LOG=true
ENV FRONTEND_WEB_DIR=/app/frontend-web/dist
ENV FRONTEND_ADMIN_DIR=/app/frontend-admin/dist

# Start the server
CMD ["/app/bin/haskell-servant-realworld-exe"]
