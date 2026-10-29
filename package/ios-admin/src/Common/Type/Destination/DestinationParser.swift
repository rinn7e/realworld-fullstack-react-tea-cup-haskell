import CommonEnv
import Foundation

// The only code that knows how a destination is spelled in a URL. The deep link
// `sentinel://users` is the `/users` of the web app: its host is the first
// piece of the path.

private func pathPieces(_ url: URL) -> [String] {
  ([url.host ?? ""] + url.pathComponents).filter { !$0.isEmpty && $0 != "/" }
}

public func parseDestination(_ url: URL) -> Destination {
  let screen: Screen =
    switch pathPieces(url) {
    case []: .homeScreen
    case ["login"]: .loginScreen
    case ["articles"]: .articleScreen
    case ["users"]: .userScreen
    case ["comments"]: .commentScreen
    case ["visitors"]: .visitorScreen
    case ["settings"]: .settingScreen
    default: .notFoundScreen
    }
  return destinationOfScreen(screen)
}

public func toUrlString(_ destination: Destination) -> String {
  let path =
    switch destination.screen {
    case .homeScreen: ""
    case .loginScreen: "login"
    case .articleScreen: "articles"
    case .userScreen: "users"
    case .commentScreen: "comments"
    case .visitorScreen: "visitors"
    case .settingScreen: "settings"
    case .notFoundScreen: "404"
    }
  return "\(URL_SCHEME)://\(path)"
}
