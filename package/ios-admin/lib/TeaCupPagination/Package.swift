// swift-tools-version: 6.0
import PackageDescription

// A paged list, ported from @rinn7e/tea-cup-pagination
let package = Package(
  name: "TeaCupPagination",
  platforms: [.iOS(.v18), .macOS(.v15)],
  products: [.library(name: "TeaCupPagination", targets: ["TeaCupPagination"])],
  dependencies: [.package(path: "../TeaCup")],
  targets: [.target(name: "TeaCupPagination", dependencies: ["TeaCup"])],
  swiftLanguageModes: [.v5]
)
