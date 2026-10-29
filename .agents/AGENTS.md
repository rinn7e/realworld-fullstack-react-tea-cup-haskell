# Workspace Agent Instructions

When starting to work on any task in `realworld-fullstack-react-tea-cup-haskell`, you MUST read and strictly follow the corresponding `code-convention.md` of each project located in its `doc/` directory:

- [package/frontend-web/doc/code-convention.md](file:///Users/rinn7e/projects/rinn7e-technology/realworld-fullstack-react-tea-cup-haskell/package/frontend-web/doc/code-convention.md)
- [package/frontend-design-system/doc/code-convention.md](file:///Users/rinn7e/projects/rinn7e-technology/realworld-fullstack-react-tea-cup-haskell/package/frontend-design-system/doc/code-convention.md)
- [package/frontend-admin/doc/code-convention.md](file:///Users/rinn7e/projects/rinn7e-technology/realworld-fullstack-react-tea-cup-haskell/package/frontend-admin/doc/code-convention.md)
- [package/frontend-admin-core/README.md](../package/frontend-admin-core/README.md) and [package/cli-admin/README.md](../package/cli-admin/README.md): frontend-admin and cli-admin share the core (the Model, Msg, update and API), which follows the code convention of frontend-admin. A change to what a screen does goes in the core; then update the views of both apps, and run `pnpm check`, `pnpm lint` and `pnpm test` in all three packages.
- [package/backend/doc/code-convention.md](file:///Users/rinn7e/projects/rinn7e-technology/realworld-fullstack-react-tea-cup-haskell/package/backend/doc/code-convention.md)
- [package/mobile-admin-ios/README.md](../package/mobile-admin-ios/README.md): the conventions of the iOS app are its sections Modules and Names (one module per file, prefixed public names, `@_spi` kept to the folder). After changing files or imports, run `python3 script/gen-package.py` and `script/check-spi.sh` in `package/mobile-admin-ios`.
- [package/mobile-admin-android/README.md](../package/mobile-admin-android/README.md): the conventions of the Android app are its sections "From frontend-admin to mobile-admin-android" and "Modules and Names" (a folder is a package, plain TEA names, other modules imported with an alias). After a change, run `./gradlew testDebugUnitTest assembleDebug` in `package/mobile-admin-android`.
