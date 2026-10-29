# Workspace Agent Instructions

When starting to work on any task in `realworld-fullstack-react-tea-cup-haskell`, you MUST read and strictly follow the corresponding `code-convention.md` of each project located in its `doc/` directory:

- [package/frontend-web/doc/code-convention.md](file:///Users/rinn7e/projects/rinn7e-technology/realworld-fullstack-react-tea-cup-haskell/package/frontend-web/doc/code-convention.md)
- [package/frontend-design-system/doc/code-convention.md](file:///Users/rinn7e/projects/rinn7e-technology/realworld-fullstack-react-tea-cup-haskell/package/frontend-design-system/doc/code-convention.md)
- [package/frontend-admin/doc/code-convention.md](file:///Users/rinn7e/projects/rinn7e-technology/realworld-fullstack-react-tea-cup-haskell/package/frontend-admin/doc/code-convention.md)
- [package/backend/doc/code-convention.md](file:///Users/rinn7e/projects/rinn7e-technology/realworld-fullstack-react-tea-cup-haskell/package/backend/doc/code-convention.md)
- [package/ios-admin/README.md](../package/ios-admin/README.md): the conventions of the iOS app are its sections Modules and Names (one module per file, prefixed public names, `@_spi` kept to the folder). After changing files or imports, run `python3 script/gen-package.py` and `script/check-spi.sh` in `package/ios-admin`.
- [package/android-admin/README.md](../package/android-admin/README.md): the conventions of the Android app are its sections "From frontend-admin to android-admin" and "Modules and Names" (a folder is a package, plain TEA names, other modules imported with an alias). After a change, run `./gradlew testDebugUnitTest assembleDebug` in `package/android-admin`.
