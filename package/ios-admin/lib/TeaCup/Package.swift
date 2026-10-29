// swift-tools-version: 6.0
import PackageDescription

// The TEA runtime of the app, in the place of react-tea-cup, tea-cup-fp and
// tea-cup-prelude
let package = Package(
  name: "TeaCup",
  platforms: [.iOS(.v18), .macOS(.v15)],
  products: [.library(name: "TeaCup", targets: ["TeaCup"])],
  targets: [.target(name: "TeaCup")],
  swiftLanguageModes: [.v5]
)
