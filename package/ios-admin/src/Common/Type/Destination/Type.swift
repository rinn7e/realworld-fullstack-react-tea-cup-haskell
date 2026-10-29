// The screen a destination shows. None of the admin screens has a param.
public enum Screen: Equatable, Hashable {
  case homeScreen
  case loginScreen
  case articleScreen
  case userScreen
  case commentScreen
  case visitorScreen
  case settingScreen
  case notFoundScreen
}

// Where the app is. Never stored: read from the models that show it
// (`destinationOf`). A destination the guard let through is a
// `DestinationAfterGuard`, declared next to the guard that owns it
// (`Util/Guard.swift`).
public struct Destination: Equatable {
  public let screen: Screen

  public init(screen: Screen) {
    self.screen = screen
  }
}

public func destinationOfScreen(_ screen: Screen) -> Destination {
  Destination(screen: screen)
}

public func defaultDestination() -> Destination {
  destinationOfScreen(.homeScreen)
}

public func loginDestination() -> Destination {
  destinationOfScreen(.loginScreen)
}

// Every move of the app goes through `navigationMsgHandler`. `UrlChanged` is a
// deep link, the only move that comes from a URL after the boot.
public enum NavigationMsg {
  case navigate(Destination, forceRefresh: Bool = false)
  case modifyDestination((Destination) -> Destination, forceRefresh: Bool = false)
  case refresh
  case urlChanged(Destination)
}
