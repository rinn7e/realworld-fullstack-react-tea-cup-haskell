# SPDX-FileCopyrightText: 2026 Serokell <https://serokell.io>
#
# SPDX-License-Identifier: CC0-1.0

{
  description = "Haskell Servant RealWorld Backend Dev Environment (haskell.nix)";

  inputs = {
    haskell-nix.url = "github:input-output-hk/haskell.nix";
    nixpkgs.follows = "haskell-nix/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, haskell-nix, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        overlays = [ haskell-nix.overlay ];
        pkgs = import nixpkgs { inherit system overlays; };

        # Project defined by stackProject using the local stack.yaml
        project = pkgs.haskell-nix.stackProject {
          src = ./.;
        };

        # The executable package component
        haskellApp = project.haskell-servant-realworld.components.exes.haskell-servant-realworld-exe;
        migrateApp = project.haskell-servant-realworld.components.exes.migrate-exe;

        # haskell.nix development shell that exposes GHC with all dependencies pre-installed
        projectShell = project.shellFor {
          # We specify the local package in the project
          packages = ps: [ ps.haskell-servant-realworld ];

          # We specify tools like cabal, hls, etc. matching GHC version
          tools = {
            cabal = "latest";
            haskell-language-server = "latest";
            fourmolu = "latest";
            hlint = "latest";
          };

          # System libraries needed in the dev shell
          buildInputs = [
            pkgs.postgresql
            pkgs.zlib
            pkgs.gnumake
            pkgs.stack
            pkgs.hpack
          ];

          shellHook = ''
            export LD_LIBRARY_PATH="${pkgs.postgresql}/lib:${pkgs.zlib}/lib:$LD_LIBRARY_PATH"
            echo "===================================================="
            echo "  Welcome to the Haskell Servant RealWorld Dev Shell (haskell.nix)! 🚀"
            echo "  Using GHC 9.8.4 matching your stack.yaml resolver!"
            echo "===================================================="
          '';
        };

        # A lean shell for caching builder dependencies in Docker (no developer/editor tools)
        buildShell = project.shellFor {
          packages = ps: [ ps.haskell-servant-realworld ];
          buildInputs = [
            pkgs.postgresql
            pkgs.zlib
            pkgs.gnumake
            pkgs.hpack
          ];
        };

      in
      {
        packages = {
          default = haskellApp;
          migrate = migrateApp;
        };

        devShells = {
          default = projectShell;
          build = buildShell;
        };
      });
}
