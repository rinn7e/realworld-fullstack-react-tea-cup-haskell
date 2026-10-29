// Module: MyApp_Type

import Common_Type_AuthUser
import Common_Type_Destination_Type
import Common_Type_Shared
import Foundation
@_spi(MyApp) import MyApp_Util_Guard
import Screen_ArticleScreen_Type
import Screen_CommentScreen_Type
import Screen_HomeScreen_Type
import Screen_LoginScreen_Type
import Screen_SettingScreen_Type
import Screen_UserScreen_Type
import Screen_VisitorScreen_Type
import Theme_Type

@_spi(MyApp) public struct Model: Equatable {
  @_spi(MyApp) public var screenModel: CurrentScreenModel
  @_spi(MyApp) public var shared: Shared
  @_spi(MyApp) public var theme: Theme
  @_spi(MyApp) public var colorScheme: Theme.ColorScheme

  @_spi(MyApp) public init(screenModel: CurrentScreenModel, shared: Shared, theme: Theme, colorScheme: Theme.ColorScheme) {
    self.screenModel = screenModel
    self.shared = shared
    self.theme = theme
    self.colorScheme = colorScheme
  }
}

// The screen shown, as its model. Its case is the destination's screen
// (`currentScreenOf`): a `currentScreen` field next to it would say the same
// thing twice.
@_spi(MyApp) public enum ScreenModel: Equatable {
  case homeScreenModel(HomeScreenModel)
  case loginScreenModel(LoginScreenModel)
  case articleScreenModel(ArticleScreenModel)
  case userScreenModel(UserScreenModel)
  case commentScreenModel(CommentScreenModel)
  case visitorScreenModel(VisitorScreenModel)
  case settingScreenModel
  case notFoundScreenModel
}

// The screen shown (`Model.screenModel`). Owned: read it anywhere through
// `screenModel`, but only the two functions below make one (the initializer is
// file private). So the screen changes only by a move; its own messages change
// its model in place. Review: a new maker in this file that skips the move
// changes the screen without one.
@_spi(MyApp) public struct CurrentScreenModel: Equatable {
  @_spi(MyApp) public let screenModel: ScreenModel

  fileprivate init(_ screenModel: ScreenModel) {
    self.screenModel = screenModel
  }

  // The screen model a move opens: the destination the guard let through
  // (`initScreenModel`). Review: called by the navigation
  // (`NavigationHandler.swift`) and tests only; anywhere else it changes the
  // screen without the move.
  @_spi(MyApp) public static func ofMove(_ destination: DestinationAfterGuard, _ screenModel: ScreenModel) -> CurrentScreenModel {
    CurrentScreenModel(screenModel)
  }

  // The screen shown with its model changed in place by its own messages.
  // Another screen keeps the one shown: that is a move. Review: for the model
  // of the screen shown; to open another screen, navigate.
  @_spi(MyApp) public func sameScreenWith(_ screenModel: ScreenModel) -> CurrentScreenModel {
    currentScreenOf(screenModel) == currentScreenOf(self.screenModel) ? CurrentScreenModel(screenModel) : self
  }
}

@_spi(MyApp) public enum Msg {
  case navigationMsg(NavigationMsg)
  case initialize(user: AuthUser?, isUnavailable: Bool, token: String?)
  case homeScreenMsg(HomeScreenMsg)
  case loginScreenMsg(LoginScreenMsg)
  case articleScreenMsg(ArticleScreenMsg)
  case userScreenMsg(UserScreenMsg)
  case commentScreenMsg(CommentScreenMsg)
  case visitorScreenMsg(VisitorScreenMsg)
  // The logout, theme and color scheme of the settings (the web app has
  // them as root messages, `Logout`, `SwitchTheme`, `SetColorScheme`)
  case settingScreenMsg(SettingScreenMsg)
  case noOp
}

// The screen shown (the destination's `screen`, `destinationOf`)
@_spi(MyApp) public func currentScreenOf(_ screenModel: ScreenModel) -> Screen {
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

@_spi(MyApp) public func withScreenModel(_ model: Model, _ screenModel: CurrentScreenModel) -> Model {
  var updatedModel = model
  updatedModel.screenModel = screenModel
  return updatedModel
}
