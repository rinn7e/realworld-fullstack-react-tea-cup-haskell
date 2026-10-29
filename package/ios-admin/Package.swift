// swift-tools-version: 6.0
import PackageDescription

// The modules of the app: one per folder of `src/` (generated, then kept by
// hand). A module is named after its path with `_` between the folders, the
// Swift form of a Haskell module name (`Common/API/Type` is `Common_API_Type`:
// a Swift module name cannot hold a dot), and its dependencies are the
// modules its files import. SwiftPM refuses a cycle, so the layers of the code
// convention of frontend-admin hold: `Common` imports no component or screen,
// a component imports no screen, and a screen imports no other screen. The
// app target (`project.yml`) is the top of the tree.
let package = Package(
  name: "SentinelAdminModules",
  platforms: [.iOS(.v18), .macOS(.v15)],
  products: [
    .library(name: "Package_TeaCup", targets: ["Package_TeaCup"]),
    .library(name: "Package_TeaCupPagination", targets: ["Package_TeaCupPagination"]),
    .library(name: "Theme", targets: ["Theme"]),
    .library(name: "Common_Env", targets: ["Common_Env"]),
    .library(name: "Common_Cache", targets: ["Common_Cache"]),
    .library(name: "Common_Type", targets: ["Common_Type"]),
    .library(name: "Common_Type_Destination", targets: ["Common_Type_Destination"]),
    .library(name: "Common_API_Type", targets: ["Common_API_Type"]),
    .library(name: "Common_API_Handler", targets: ["Common_API_Handler"]),
    .library(name: "Component_DetailRow", targets: ["Component_DetailRow"]),
    .library(name: "Component_ListState", targets: ["Component_ListState"]),
    .library(name: "Component_PagedList", targets: ["Component_PagedList"]),
    .library(name: "Component_PaginationNav", targets: ["Component_PaginationNav"]),
    .library(name: "Component_ProfileThumbnail", targets: ["Component_ProfileThumbnail"]),
    .library(name: "Component_RoleBadge", targets: ["Component_RoleBadge"]),
    .library(name: "Component_SearchBar", targets: ["Component_SearchBar"]),
    .library(name: "Screen_HomeScreen", targets: ["Screen_HomeScreen"]),
    .library(name: "Screen_LoginScreen", targets: ["Screen_LoginScreen"]),
    .library(name: "Screen_ArticleScreen", targets: ["Screen_ArticleScreen"]),
    .library(name: "Screen_UserScreen", targets: ["Screen_UserScreen"]),
    .library(name: "Screen_CommentScreen", targets: ["Screen_CommentScreen"]),
    .library(name: "Screen_VisitorScreen", targets: ["Screen_VisitorScreen"]),
    .library(name: "Screen_SettingScreen", targets: ["Screen_SettingScreen"]),
  ],
  targets: [
    // The TEA runtime, in the place of react-tea-cup, tea-cup-fp and tea-cup-prelude
    .target(name: "Package_TeaCup", path: "src/Package/TeaCup"),
    // A paged list, ported from @rinn7e/tea-cup-pagination
    .target(name: "Package_TeaCupPagination", dependencies: ["Package_TeaCup"], path: "src/Package/TeaCupPagination"),
    .target(name: "Theme", path: "src/Theme"),
    .target(name: "Common_Env", path: "src/Common/Env"),
    .target(name: "Common_Cache", path: "src/Common/Cache"),
    .target(name: "Common_Type", path: "src/Common/Type", exclude: ["Destination"]),
    .target(name: "Common_Type_Destination", dependencies: ["Common_Env"], path: "src/Common/Type/Destination"),
    .target(name: "Common_API_Type", path: "src/Common/API/Type"),
    .target(name: "Common_API_Handler", dependencies: ["Common_API_Type", "Common_Env", "Common_Type"], path: "src/Common/API/Handler"),
    .target(name: "Component_DetailRow", path: "src/Component/DetailRow"),
    .target(name: "Component_ListState", dependencies: ["Common_API_Type"], path: "src/Component/ListState"),
    .target(name: "Component_PagedList", dependencies: ["Common_API_Type", "Component_ListState", "Component_PaginationNav", "Package_TeaCup"], path: "src/Component/PagedList"),
    .target(name: "Component_PaginationNav", dependencies: ["Package_TeaCup"], path: "src/Component/PaginationNav"),
    .target(name: "Component_ProfileThumbnail", path: "src/Component/ProfileThumbnail"),
    .target(name: "Component_RoleBadge", path: "src/Component/RoleBadge"),
    .target(name: "Component_SearchBar", dependencies: ["Common_Type", "Package_TeaCup"], path: "src/Component/SearchBar"),
    .target(name: "Screen_HomeScreen", dependencies: ["Common_API_Handler", "Common_API_Type", "Common_Type", "Component_DetailRow", "Package_TeaCup"], path: "src/Screen/HomeScreen"),
    .target(name: "Screen_LoginScreen", dependencies: ["Common_API_Handler", "Common_API_Type", "Package_TeaCup"], path: "src/Screen/LoginScreen"),
    .target(name: "Screen_ArticleScreen", dependencies: ["Common_API_Handler", "Common_API_Type", "Common_Type", "Component_DetailRow", "Component_PagedList", "Component_ProfileThumbnail", "Component_SearchBar", "Package_TeaCup", "Package_TeaCupPagination"], path: "src/Screen/ArticleScreen"),
    .target(name: "Screen_UserScreen", dependencies: ["Common_API_Handler", "Common_API_Type", "Common_Type", "Component_DetailRow", "Component_PagedList", "Component_ProfileThumbnail", "Component_RoleBadge", "Component_SearchBar", "Package_TeaCup", "Package_TeaCupPagination"], path: "src/Screen/UserScreen"),
    .target(name: "Screen_CommentScreen", dependencies: ["Common_API_Handler", "Common_API_Type", "Common_Type", "Component_DetailRow", "Component_PagedList", "Component_ProfileThumbnail", "Component_SearchBar", "Package_TeaCup", "Package_TeaCupPagination"], path: "src/Screen/CommentScreen"),
    .target(name: "Screen_VisitorScreen", dependencies: ["Common_API_Handler", "Common_API_Type", "Common_Type", "Component_DetailRow", "Component_PagedList", "Component_RoleBadge", "Component_SearchBar", "Package_TeaCup", "Package_TeaCupPagination"], path: "src/Screen/VisitorScreen"),
    .target(name: "Screen_SettingScreen", dependencies: ["Common_Type", "Component_ProfileThumbnail", "Package_TeaCup", "Theme"], path: "src/Screen/SettingScreen"),
  ],
  swiftLanguageModes: [.v5]
)
