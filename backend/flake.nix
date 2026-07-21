{
  description = "Haskell Servant RealWorld Backend Dev Environment (haskell.nix)";

  nixConfig = {
    # Use your custom GitHub flake registry! This is portable and resolves inputs via your registry definitions.
    flake-registry = "https://raw.githubusercontent.com/rinn7e/flake-registry/master/flake-registry.json";
  };

  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
    
    haskell-nix = {
      inputs.hackage.follows = "hackage";
      inputs.stackage.follows = "stackage";
    };
    
    hackage = {
      flake = false;
    };
    
    stackage = {
      flake = false;
    };
  };

  outputs = { self, nixpkgs, haskell-nix, hackage, stackage, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        overlays = [ haskell-nix.overlay ];
        pkgs = import nixpkgs { inherit system overlays; };

        # Use haskell-nix's legacyPackages (fully cached on cache.iog.io)
        haskellPkgs = haskell-nix.legacyPackages."${system}";

        # Project defined by stackProject using the local stack.yaml.
        # Evaluated using haskellPkgs to prevent rebuilding GHC from source.
        project = haskellPkgs.haskell-nix.stackProject {
          src = ./.;
        };

        # The executable package components
        haskellApp = project.haskell-servant-realworld.components.exes.haskell-servant-realworld-exe;
        migrateApp = project.haskell-servant-realworld.components.exes.migrate-exe;

        # Lean development shell:
        # We remove heavy developer tools (HLS, linters, formatters) from nixpkgs
        # to prevent Nix from compiling GHC 9.6.6 and HLS from source on macOS aarch64.
        projectShell = project.shellFor {
          packages = ps: [ ps.haskell-servant-realworld ];
          withHoogle = false;

          buildInputs = [
            # Only the essential tools required to run cabal build and link libraries
            pkgs.cabal-install
            pkgs.hpack

            # System Libraries (from the primary pkgs)
            pkgs.postgresql
            pkgs.zlib
            pkgs.gnumake
          ];

          shellHook = ''
            export LD_LIBRARY_PATH="${pkgs.postgresql}/lib:${pkgs.zlib}/lib:$LD_LIBRARY_PATH"
            echo "===================================================="
            echo "  Welcome to the Haskell Servant RealWorld Dev Shell (haskell.nix)! 🚀"
            echo "  Using GHC 9.8.4 matching your stack.yaml resolver!"
            echo "  Using cached helper tools from cache.nixos.org!"
            echo "===================================================="
          '';
        };

        # A lean shell for caching builder dependencies in Docker (no developer/editor tools)
        buildShell = project.shellFor {
          packages = ps: [ ps.haskell-servant-realworld ];
          withHoogle = false;
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
