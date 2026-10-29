// swift-tools-version: 6.0
import PackageDescription

// The modules of the app: one per folder of `src/` (generated, then kept by
// hand). A module is named after its path, the Swift form of a Haskell module
// name (`Common/API/Type` is `CommonAPIType`), and its dependencies are the
// modules its files import. SwiftPM refuses a cycle, so the layers of the code
// convention of frontend-admin hold: `Common` imports no component or screen,
// a component imports no screen, and a screen imports no other screen. The
// app target (`project.yml`) is the top of the tree.
let package = Package(
  name: "SentinelAdminModules",
  platforms: [.iOS(.v18), .macOS(.v15)],
  products: [
    .library(name: "Theme", targets: ["Theme"]),
    .library(name: "CommonEnv", targets: ["CommonEnv"]),
    .library(name: "CommonCache", targets: ["CommonCache"]),
    .library(name: "CommonType", targets: ["CommonType"]),
    .library(name: "CommonTypeDestination", targets: ["CommonTypeDestination"]),
    .library(name: "CommonAPIType", targets: ["CommonAPIType"]),
    .library(name: "CommonAPIHandler", targets: ["CommonAPIHandler"]),
    .library(name: "ComponentDetailRow", targets: ["ComponentDetailRow"]),
    .library(name: "ComponentListState", targets: ["ComponentListState"]),
    .library(name: "ComponentPagedList", targets: ["ComponentPagedList"]),
    .library(name: "ComponentPaginationNav", targets: ["ComponentPaginationNav"]),
    .library(name: "ComponentProfileThumbnail", targets: ["ComponentProfileThumbnail"]),
    .library(name: "ComponentRoleBadge", targets: ["ComponentRoleBadge"]),
    .library(name: "ComponentSearchBar", targets: ["ComponentSearchBar"]),
  ],
  dependencies: [
    .package(path: "lib/TeaCup"),
  ],
  targets: [
    .target(name: "Theme", path: "src/Theme"),
    .target(name: "CommonEnv", path: "src/Common/Env"),
    .target(name: "CommonCache", path: "src/Common/Cache"),
    .target(name: "CommonType", path: "src/Common/Type", exclude: ["Destination"]),
    .target(name: "CommonTypeDestination", dependencies: ["CommonEnv"], path: "src/Common/Type/Destination"),
    .target(name: "CommonAPIType", path: "src/Common/API/Type"),
    .target(name: "CommonAPIHandler", dependencies: ["CommonAPIType", "CommonEnv", "CommonType"], path: "src/Common/API/Handler"),
    .target(name: "ComponentDetailRow", path: "src/Component/DetailRow"),
    .target(name: "ComponentListState", dependencies: ["CommonAPIType"], path: "src/Component/ListState"),
    .target(name: "ComponentPagedList", dependencies: ["CommonAPIType", "ComponentListState", "ComponentPaginationNav", .product(name: "TeaCup", package: "TeaCup")], path: "src/Component/PagedList"),
    .target(name: "ComponentPaginationNav", dependencies: [.product(name: "TeaCup", package: "TeaCup")], path: "src/Component/PaginationNav"),
    .target(name: "ComponentProfileThumbnail", path: "src/Component/ProfileThumbnail"),
    .target(name: "ComponentRoleBadge", path: "src/Component/RoleBadge"),
    .target(name: "ComponentSearchBar", dependencies: ["CommonType", .product(name: "TeaCup", package: "TeaCup")], path: "src/Component/SearchBar"),
  ],
  swiftLanguageModes: [.v5]
)
