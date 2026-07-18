{
  description = "Haskell Servant RealWorld Backend Dev Environment";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };

        # Define GHC with all dependencies pre-installed from Nix cache
        ghcEnv = pkgs.haskellPackages.ghcWithPackages (ps: with ps; [
          # App dependencies
          aeson
          crypton
          esqueleto
          appendmap
          http-types
          jose
          lens
          monad-logger
          persistent
          persistent-postgresql
          persistent-template
          resource-pool
          servant-auth
          servant-auth-server
          servant-server
          wai
          wai-cors
          wai-extra
          warp
          password
          effectful
          effectful-core
          unliftio
          openapi3
          servant-openapi3
          servant-swagger-ui
          insert-ordered-containers
          raw-strings-qq
          http-api-data

          # Test dependencies
          hspec
        ]);

        # Package derivation for nix build
        haskellApp = pkgs.haskellPackages.callCabal2nix "haskell-servant-realworld" ./. {};
      in
      {
        packages.default = haskellApp;

        # Development shell
        devShells.default = pkgs.mkShell {
          buildInputs = [
            # GHC bundled with our libraries
            ghcEnv

            # Other tools
            pkgs.cabal-install
            pkgs.haskell-language-server
            pkgs.fourmolu
            pkgs.hlint
            pkgs.stack

            # System Libraries
            pkgs.postgresql
            pkgs.zlib
            pkgs.gnumake
          ];

          shellHook = ''
            export LD_LIBRARY_PATH="${pkgs.postgresql}/lib:${pkgs.zlib}/lib:$LD_LIBRARY_PATH"
            echo "===================================================="
            echo "  Welcome to the Haskell Servant RealWorld Dev Shell! 🚀"
            echo "  Using pre-compiled packages from the Nix cache!"
            echo "===================================================="
          '';
        };
      });
}
