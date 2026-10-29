// The screen a destination shows. None of the admin screens has a param.
enum Screen: Equatable, Hashable {
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
struct Destination: Equatable {
  let screen: Screen
}

func destinationOfScreen(_ screen: Screen) -> Destination {
  Destination(screen: screen)
}

func defaultDestination() -> Destination {
  destinationOfScreen(.homeScreen)
}

func loginDestination() -> Destination {
  destinationOfScreen(.loginScreen)
}

// Every move of the app goes through `navigationMsgHandler`. `UrlChanged` is a
// deep link, the only move that comes from a URL after the boot.
enum NavigationMsg {
  case navigate(Destination, forceRefresh: Bool = false)
  case modifyDestination((Destination) -> Destination, forceRefresh: Bool = false)
  case refresh
  case urlChanged(Destination)
}
