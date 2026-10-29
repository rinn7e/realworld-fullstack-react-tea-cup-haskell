// swift-tools-version: 6.0
import PackageDescription

// The modules of the app, one per layer of the code convention of
// frontend-admin ("Dependency Order and Hierarchy"): a module may only import
// the ones below it. The sources stay in `src/`; each target points at its
// folder. The app target (`project.yml`) is the top of the tree.
let package = Package(
  name: "SentinelAdminModules",
  platforms: [.iOS(.v18), .macOS(.v15)],
  products: [
    .library(name: "Theme", targets: ["Theme"]),
    .library(name: "Common", targets: ["Common"]),
  ],
  targets: [
    // src/theme of the web app
    .target(name: "Theme", path: "src/Theme"),
    // src/common of the web app: imports nothing of the app
    .target(name: "Common", path: "src/Common"),
  ],
  swiftLanguageModes: [.v5]
)
