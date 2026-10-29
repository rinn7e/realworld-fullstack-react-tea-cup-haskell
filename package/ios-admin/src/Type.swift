import Foundation

struct Model: Equatable {
  var screenModel: CurrentScreenModel
  var shared: Shared
  var theme: Theme
  var colorScheme: ColorScheme
}

// The screen shown, as its model. Its case is the destination's screen
// (`currentScreenOf`): a `currentScreen` field next to it would say the same
// thing twice.
enum ScreenModel: Equatable {
  case homeScreenModel(HomeScreen.Model)
  case loginScreenModel(LoginScreen.Model)
  case articleScreenModel(ArticleScreen.Model)
  case userScreenModel(UserScreen.Model)
  case commentScreenModel(CommentScreen.Model)
  case visitorScreenModel(VisitorScreen.Model)
  case settingScreenModel
  case notFoundScreenModel
}

// The screen shown (`Model.screenModel`). Owned: read it anywhere through
// `screenModel`, but only the two functions below make one (the initializer is
// file private). So the screen changes only by a move; its own messages change
// its model in place. Review: a new maker in this file that skips the move
// changes the screen without one.
struct CurrentScreenModel: Equatable {
  let screenModel: ScreenModel

  fileprivate init(_ screenModel: ScreenModel) {
    self.screenModel = screenModel
  }

  // The screen model a move opens: the destination the guard let through
  // (`initScreenModel`). Review: called by the navigation
  // (`NavigationHandler.swift`) and tests only; anywhere else it changes the
  // screen without the move.
  static func ofMove(_ destination: DestinationAfterGuard, _ screenModel: ScreenModel) -> CurrentScreenModel {
    CurrentScreenModel(screenModel)
  }

  // The screen shown with its model changed in place by its own messages.
  // Another screen keeps the one shown: that is a move. Review: for the model
  // of the screen shown; to open another screen, navigate.
  func sameScreenWith(_ screenModel: ScreenModel) -> CurrentScreenModel {
    currentScreenOf(screenModel) == currentScreenOf(self.screenModel) ? CurrentScreenModel(screenModel) : self
  }
}

enum Msg {
  case navigationMsg(NavigationMsg)
  case initialize(user: AuthUser?, isUnavailable: Bool, token: String?)
  case logout
  case homeScreenMsg(HomeScreen.Msg)
  case loginScreenMsg(LoginScreen.Msg)
  case articleScreenMsg(ArticleScreen.Msg)
  case userScreenMsg(UserScreen.Msg)
  case commentScreenMsg(CommentScreen.Msg)
  case visitorScreenMsg(VisitorScreen.Msg)
  case switchTheme(Theme)
  case setColorScheme(ColorScheme)
  case noOp
}

// The screen shown (the destination's `screen`, `destinationOf`)
func currentScreenOf(_ screenModel: ScreenModel) -> Screen {
  switch screenModel {
  case .homeScreenModel: .homeScreen
  case .loginScreenModel: .loginScreen
  case .articleScreenModel: .articleScreen
  case .userScreenModel: .userScreen
  case .commentScreenModel: .commentScreen
  case .visitorScreenModel: .visitorScreen
  case .settingScreenModel: .settingScreen
  case .notFoundScreenModel: .notFoundScreen
  }
}

func withScreenModel(_ model: Model, _ screenModel: CurrentScreenModel) -> Model {
  var updatedModel = model
  updatedModel.screenModel = screenModel
  return updatedModel
}
