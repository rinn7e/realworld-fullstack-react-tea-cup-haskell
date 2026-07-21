# syntax=docker/dockerfile:1
# check=skip=FromPlatformFlagConstDisallowed
# --- Build Stage ---
FROM --platform=linux/amd64 nixos/nix:latest AS builder

# Enable flakes and disable sandboxing
RUN echo "experimental-features = nix-command flakes" >> /etc/nix/nix.conf && \
    echo "sandbox = false" >> /etc/nix/nix.conf && \
    echo "filter-syscalls = false" >> /etc/nix/nix.conf && \
    echo "substituters = https://cache.nixos.org https://cache.iog.io https://rinn7e.cachix.org" >> /etc/nix/nix.conf && \
    echo "trusted-public-keys = cache.nixos.org-1:6NCHdD59X431o0gWypbMrAURkbJ16ZPMQFGspcDShjY= hydra.iohk.io:f/Ea+s+dFdN+3Y/G+FDgSq+a5NEWhJGzdjvKNGv0/EQ= rinn7e.cachix.org-1:Nt+WWMAPnqJ6mrDtLvNOdJOsH+CZsygvwupCb99aXbM=" >> /etc/nix/nix.conf

WORKDIR /app

# Copy ONLY the configuration files first to cache dependencies.
# We use --link and exclude the .cabal file to prevent local code changes or
# auto-generated cabal updates from invalidating the GHC download cache.
COPY --link flake.nix flake.lock cabal.project package.yaml stack.yaml stack.yaml.lock ./

# Fetch and build all dependencies in the GHC environment, caching this Docker layer.
# We save it as a persistent profile so GHC and dependencies are cached in the /nix/store.
# We target the lean .#build shell to exclude massive editor/formatting tools.
# We mount a persistent cache for Nix's evaluation/git database and mount the Cachix token secret.
# We launch 'cachix watch-store' in the background to push compiled dependency libraries.
RUN --mount=type=cache,target=/root/.cache/nix \
    --mount=type=secret,id=CACHIX_AUTH_TOKEN \
    if [ -f /run/secrets/CACHIX_AUTH_TOKEN ]; then \
        export CACHIX_AUTH_TOKEN=$(cat /run/secrets/CACHIX_AUTH_TOKEN) && \
        nix run nixpkgs#cachix -- \
            --extra-experimental-features "nix-command flakes" \
            --option sandbox false \
            --option filter-syscalls false \
            watch-store rinn7e & \
    fi && \
    nix develop .#build \
        --extra-experimental-features "nix-command flakes" \
        --option sandbox false \
        --option filter-syscalls false \
        --profile /app/dev-profile --command true

# Now copy the rest of the source code
COPY --link . .

# Build the Haskell project (reusing GHC and libraries from the cached Docker layer!)
# We mount a persistent cache for Nix's evaluation/git database and mount the Cachix token secret
RUN --mount=type=cache,target=/root/.cache/nix \
    --mount=type=secret,id=CACHIX_AUTH_TOKEN \
    if [ -f /run/secrets/CACHIX_AUTH_TOKEN ]; then \
        export CACHIX_AUTH_TOKEN=$(cat /run/secrets/CACHIX_AUTH_TOKEN) && \
        nix run nixpkgs#cachix -- \
            --extra-experimental-features "nix-command flakes" \
            --option sandbox false \
            --option filter-syscalls false \
            watch-store rinn7e & \
    fi && \
    nix build path:.#default \
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
COPY --link dist/web /app/dist/web
COPY --link dist/admin /app/dist/admin

# Expose port
EXPOSE 3000

# Set environment defaults (can be overridden at runtime)
ENV PORT=3000
ENV SHOULD_RUN_MIGRATION_AUTOMATICALLY=true
ENV ALLOW_CORS=true
ENV SHOW_SQL_LOG=true
ENV FRONTEND_WEB_DIR=/app/dist/web
ENV FRONTEND_ADMIN_DIR=/app/dist/admin

# Start the server
CMD ["/app/bin/haskell-servant-realworld-exe"]
