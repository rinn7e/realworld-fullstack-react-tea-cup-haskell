# Deployment Strategy: Building a Nix/Haskell App into a Deployable Image

This document covers *how* the production image gets built and shipped — as
distinct from [deployment-flyio-supabase.md](./deployment-flyio-supabase.md),
which covers the Fly.io/Supabase setup steps. It records the two standard
patterns for turning a Nix-built Haskell app into a container image, which one
this repo uses and why, and the architecture constraint that shapes the whole
setup.

---

## The hard constraint: architecture mismatch

- Local dev/build machine: Apple Silicon Mac (`arm64` / `aarch64`).
- Fly.io Machines: **`amd64`/`x86_64` only** — Fly rejects `arm64` images
  outright ("image must be amd64 architecture for linux os, found arm64
  linux"). There is no arm64 option to switch to.
- Fly's own remote builder is memory-constrained and OOMs on GHC compiles
  (see the Troubleshooting section of
  [deployment-flyio-supabase.md](./deployment-flyio-supabase.md)).

Net effect: the image has to be built *for* `amd64`, but the only machine
available to build it (the Mac) is `arm64`. Whichever packaging pattern is
used, this forces cross-architecture compilation. On macOS there's no
native Linux kernel either, so a Linux build environment is required even
before the arch mismatch is considered — nix-darwin's own `linux-builder`
solves that with a QEMU-backed VM, which is the same mechanism Docker uses
under the hood when you request `--platform=linux/amd64` on non-x86_64
hardware.

**This means QEMU (or an equivalent instruction-translation layer) is
required by either pattern below.** Switching patterns does not remove it —
only building on real `x86_64` hardware (a CI runner, a cloud VM, or a
beefed-up Fly remote builder) would. GHC's Template Haskell support (used
throughout this codebase, e.g. via `persistent`) also makes "true" native
cross-compilation impractical: TH splices need to *execute* target-arch code
at compile time, so even a proper GHC cross-compiler ends up running a
target-arch interpreter under an emulator anyway.

---

## Pattern A — Dockerfile wraps `nix build`

A multi-stage `Dockerfile` runs Nix *inside* a Docker build stage, then
copies just the built binary and its runtime closure into a minimal runner
image.

```
FROM nixos/nix:latest AS builder
  → nix build path:.#default
  → nix-store -qR result        # list the full runtime closure
  → tar the closure + copy binaries out

FROM debian:bookworm-slim AS runner
  → extract the closure tarball into /nix/store
  → copy the binary in, CMD it
```

This is a well-documented, common pattern for exactly this situation
(Nix app + Fly.io), described independently by
[sekun.net](https://www.sekun.net/blog/deploying-nix-builds-on-fly-io/) and
[Raghav Sood](https://raghavsood.com/blog/2024/06/14/nix-flakes-fly/) — both
use a `nixos/nix` base image to run `nix build`, then hand-copy the closure
into a slim runtime image, for the same reason: it works with both local
Docker builds and Fly's remote/local builders without extra tooling.

**Pros**
- Works with plain `docker build` / `fly deploy --local-only` — no extra
  Nix-on-macOS setup (no `linux-builder`, no `nix-darwin`) beyond Docker
  Desktop itself.
- Familiar mental model (Dockerfile, stages, `COPY --from`).

**Cons**
- The closure-copy step is hand-rolled (`nix-store -qR` + `tar`), which is
  exactly the kind of plumbing `dockerTools` (Pattern B) does for you, and
  where this repo hit its one real bug so far (see below).
- Two build systems layered on each other (Docker layers *and* the Nix
  store) — Docker layer caching and Nix store caching don't always agree on
  what "changed."

### How this repo uses Pattern A

[`Dockerfile`](../Dockerfile) implements this pattern directly:

- `FROM --platform=linux/amd64 nixos/nix:latest AS builder` — forces the
  amd64 target (and, on the Mac, forces QEMU emulation for this whole
  stage).
- `sandbox = false` / `filter-syscalls = false` in `nix.conf` — Nix's build
  sandbox uses Linux namespaces/seccomp, which are unreliable running two
  layers deep (Docker Desktop's Linux VM, plus QEMU emulation inside it), so
  sandboxing is disabled rather than fought.
- An early layer runs `nix develop --profile /app/dev-profile --command
  true` against just the manifest files (`flake.nix`, `flake.lock`,
  `cabal.project`, `package.yaml`, the `.cabal` file), *before* `COPY . .`,
  specifically so that editing application source doesn't bust the
  dependency-fetch layer.
- `nix build path:.#default` builds `haskellApp` (`flake.nix`'s
  `packages.default`, a `justStaticExecutables`-trimmed derivation).
- `nix-store -qR result | tar` captures the full runtime closure (glibc,
  `libpq`, `zlib`, etc.) so the debian runner doesn't need `apt-get
  install libpq-dev zlib1g-dev` — the Nix closure supplies those instead.
- `debian:bookworm-slim` runner only needs `ca-certificates` (for Supabase
  TLS) on top of the extracted closure.

---

## Pattern B — Pure Nix, no Dockerfile (`dockerTools.buildImage` / `buildLayeredImage`)

Nixpkgs' `dockerTools` builds an OCI image *declaratively*, as a Nix
derivation, with no Dockerfile at all:

```nix
dockerTools.buildLayeredImage {
  name = "app";
  contents = [ (pkgs.buildEnv { paths = [ haskellApp ]; pathsToLink = ["/bin"]; }) pkgs.cacert ];
  config.Cmd = [ "/bin/haskell-servant-realworld-exe" ];
}
```

`nix build` produces a loadable tarball directly (`docker load < result`),
and closure inclusion is automatic — no `nix-store -qR` + `tar` needed.
TLS certs come from `pkgs.cacert` + `SSL_CERT_FILE`/`SYSTEM_CERTIFICATE_PATH`
instead of `apt-get install ca-certificates`. This is the approach
documented in the
[nixpkgs dockerTools reference](https://github.com/NixOS/nixpkgs/blob/master/doc/build-helpers/images/dockertools.section.md),
the [nix.dev tutorial](https://nix.dev/tutorials/nixos/building-and-running-docker-images.html),
and specifically for Haskell projects in
[haskell-flake's docs](https://community.flake.parts/haskell-flake/docker).

**Pros**
- No hand-rolled closure/tar plumbing — `dockerTools` has already solved the
  symlink/closure-copy edge cases that caused this repo's tar segfault.
- One build system (Nix) instead of two layered on each other.
- Reproducible/declarative: the image *is* a Nix derivation.

**Cons**
- Still requires a Linux environment to run `nix build` targeting
  `x86_64-linux` on macOS (`linux-builder` / nix-darwin, or Docker as a
  stand-in Linux environment) — it doesn't remove the cross-arch build
  requirement.
- **Does not remove QEMU.** GHC still has to execute as `x86_64` machine
  code to compile the app; that's true whether the final artifact is
  assembled by a Dockerfile or by `dockerTools`. Switching to Pattern B
  would only clean up the packaging step, not the compile step where the
  actual time (and the emulation-bug risk) is spent.
- Less common tooling familiarity for anyone not already fluent in
  `dockerTools`.

### Why the repo does not use Pattern B

The deciding factor isn't just "Pattern A already works" — it's the
project's explicit deployment goal: **build on the local Mac, push the
result directly to Fly, with no CI and no separate remote build machine.**
Under that constraint, Pattern B is a worse fit, not just an untested one:

- Pattern B's Docker-free version needs its own Linux build host to run
  `nix build` for `x86_64-linux` on macOS — in practice, nix-darwin's
  `linux-builder` (a dedicated NixOS VM nix-darwin manages, configured with
  `boot.binfmt.emulatedSystems = ["x86_64-linux"]` for the amd64 target).
  That's a real, one-time piece of local infrastructure to install and
  maintain — not "no extra machine," just "no extra *remote* machine."
  Docker Desktop already provides an equivalent Linux VM for free, as a side
  effect of being installed for Pattern A.
- Pattern B's output is a Nix-built OCI tarball, which `fly deploy` doesn't
  consume directly. `fly deploy --local-only` is built around driving a
  local Docker daemon. Getting a `dockerTools` tarball onto Fly means either
  `docker load`-ing it into Docker anyway, or pushing it to Fly's registry
  with a separate tool (e.g. `skopeo`) and calling `fly deploy --image
  <ref>` — an extra bridging step either way.
- Pattern A plugs straight into the existing `fly deploy --local-only`
  workflow with nothing extra installed beyond Docker Desktop, which is
  already there.

So for this project's actual constraint, Pattern B trades "cleaner Nix
expression, no hand-rolled closure/tar logic" for "a second local Linux VM
to maintain, plus a step to translate Nix's output into something Fly's CLI
understands." That's a worse deal than it looks in the abstract, where
Pattern B is usually presented as the more idiomatic choice. Worth
revisiting only if this project's deployment target changes (e.g. moves to
a CI-driven build, or to a registry-first deploy flow instead of
`fly deploy --local-only`).

---

## Known pitfalls hit so far (Pattern A)

1. **`tar -h` symlink segfault under QEMU emulation** (exit 139/SIGSEGV).
   `tar -ch` (dereference symlinks) while archiving the Nix closure caused
   infinite recursion under QEMU's translated syscalls. Fixed by dropping
   `-h` — the symlink itself is archived instead of chasing its target,
   which is fine since the extraction step recreates the same store paths.

2. **The `nix develop` caching layer over-fetches.** The early
   dependency-warming layer runs `nix develop` against `devShells.default`,
   which includes `haskell-language-server`, `stack`, `hlint`, `fourmolu`,
   and `cabal-install` on top of the actual app dependencies — none of
   which are needed to build or run the production binary.
   `haskell-language-server` in particular is one of the largest closures
   in the Haskell Nix ecosystem. This inflates every image build with
   downloads (from `cache.nixos.org`) that have nothing to do with the
   deployed artifact. **Open TODO:** add a lean, build-only flake output
   (e.g. a `devShells.build` containing just `ghcEnv`) and point the
   Dockerfile's caching layer at that instead of `devShells.default`.

3. **Generated `.cabal` file is gitignored.** `flake.nix` builds via
   `callCabal2nix`, which needs a `.cabal` file; `.gitignore` excludes
   `*.cabal`, so only `package.yaml` is tracked in git. Locally this works
   because `docker build`'s `COPY . .` doesn't respect `.gitignore` and
   picks up whatever generated `.cabal` happens to be on disk — but editing
   `package.yaml` without re-running `hpack` before a build will silently
   ship stale dependencies/modules, and a truly fresh clone has no `.cabal`
   file to build from at all.

4. **No `.dockerignore`.** `COPY . .` sweeps in `dist-newstyle/` (~240MB of
   local build artifacts irrelevant to the Nix build), `.git`, and — more
   importantly — `.envrc`, which contains real Supabase credentials in
   plaintext. Multi-stage builds mean the final pushed image doesn't
   contain the builder stage's filesystem, but the secret still ends up in
   a local Docker layer/cache.

---

## Sources

- [Deploying Nix builds on Fly.io — sekun.net](https://www.sekun.net/blog/deploying-nix-builds-on-fly-io/)
- [Using Nix flakes and fly.io — Raghav Sood](https://raghavsood.com/blog/2024/06/14/nix-flakes-fly/)
- [nixpkgs dockerTools reference](https://github.com/NixOS/nixpkgs/blob/master/doc/build-helpers/images/dockertools.section.md)
- [Building and running Docker images — nix.dev](https://nix.dev/tutorials/nixos/building-and-running-docker-images.html)
- [Building a docker image — haskell-flake](https://community.flake.parts/haskell-flake/docker)
- [Are arm64 Fly machines available? — Fly.io community](https://community.fly.io/t/are-arm64-fly-machines-available/5902)
- [Build and Deploy Linux Systems from macOS — Nixcademy](https://nixcademy.com/posts/macos-linux-builder/)
- [Improving GHC's cross-compilation support — Well-Typed](https://well-typed.com/blog/2023/10/improving-ghc-configuration-and-cross-compilation-with-ghc-toolchain/)
- [A tale of Template Haskell and cross compilation — Tweag](https://www.tweag.io/blog/2020-11-25-asterius-th/)
