package app

import app.util.DestinationAfterGuard
import common.type.AuthUser
import common.type.Shared
import common.type.destination.NavigationMsg
import common.type.destination.Screen
import theme.Theme

data class Model(
  val screenModel: CurrentScreenModel,
  val shared: Shared,
  val theme: Theme,
  val colorScheme: Theme.ColorScheme,
)

// The screen shown, as its model. Its case is the destination's screen
// (`currentScreenOf`): a `currentScreen` field next to it would say the same
// thing twice. The models of the screens are written with their package: each
// screen names its own `Model`.
sealed interface ScreenModel {
  data class HomeScreenModel(val model: screen.homescreen.Model) : ScreenModel

  data class LoginScreenModel(val model: screen.loginscreen.Model) : ScreenModel

  data class ArticleScreenModel(val model: screen.articlescreen.Model) : ScreenModel

  data class UserScreenModel(val model: screen.userscreen.Model) : ScreenModel

  data class CommentScreenModel(val model: screen.commentscreen.Model) : ScreenModel

  data class VisitorScreenModel(val model: screen.visitorscreen.Model) : ScreenModel

  data object SettingScreenModel : ScreenModel

  data object NotFoundScreenModel : ScreenModel
}

/**
 * The screen shown (`Model.screenModel`). Owned: read it anywhere through
 * `screenModel`, but only the two functions below make one (the constructor is
 * private). So the screen changes only by a move; its own messages change its
 * model in place. Review: a new maker in this class that skips the move changes
 * the screen without one.
 */
@ConsistentCopyVisibility
data class CurrentScreenModel private constructor(val screenModel: ScreenModel) {
  // The screen shown with its model changed in place by its own messages.
  // Another screen keeps the one shown: that is a move. Review: for the model of
  // the screen shown; to open another screen, navigate.
  fun sameScreenWith(screenModel: ScreenModel): CurrentScreenModel =
    if (currentScreenOf(screenModel) == currentScreenOf(this.screenModel)) CurrentScreenModel(screenModel) else this

  companion object {
    // The screen model a move opens: the destination the guard let through
    // (`initScreenModel`). Review: called by the navigation
    // (`handler/NavigationHandler.kt`) and tests only; anywhere else it changes
    // the screen without the move.
    @Suppress("UNUSED_PARAMETER")
    fun ofMove(destination: DestinationAfterGuard, screenModel: ScreenModel): CurrentScreenModel =
      CurrentScreenModel(screenModel)
  }
}

sealed interface Msg {
  data class NavigationMsg(val msg: common.type.destination.NavigationMsg) : Msg

  // The answer of the boot: the user of the stored token, and the choices
  // kept on the device (the web app reads them before the first render; here
  // the store is read in the boot command)
  data class Initialize(
    val user: AuthUser?,
    val isUnavailable: Boolean,
    val token: String?,
    val theme: Theme,
    val colorScheme: Theme.ColorScheme,
  ) : Msg

  data class HomeScreenMsg(val msg: screen.homescreen.Msg) : Msg

  data class LoginScreenMsg(val msg: screen.loginscreen.Msg) : Msg

  data class ArticleScreenMsg(val msg: screen.articlescreen.Msg) : Msg

  data class UserScreenMsg(val msg: screen.userscreen.Msg) : Msg

  data class CommentScreenMsg(val msg: screen.commentscreen.Msg) : Msg

  data class VisitorScreenMsg(val msg: screen.visitorscreen.Msg) : Msg

  // The logout, theme and color scheme of the settings (the web app has them
  // as root messages, `Logout`, `SwitchTheme`, `SetColorScheme`)
  data class SettingScreenMsg(val msg: screen.settingscreen.Msg) : Msg

  data object NoOp : Msg
}

/** A move, as a message of the app */
fun navigationMsg(msg: NavigationMsg): Msg = Msg.NavigationMsg(msg)

// The screen shown (the destination's `screen`, `destinationOf`)
fun currentScreenOf(screenModel: ScreenModel): Screen =
  when (screenModel) {
    is ScreenModel.HomeScreenModel -> Screen.HomeScreen
    is ScreenModel.LoginScreenModel -> Screen.LoginScreen
    is ScreenModel.ArticleScreenModel -> Screen.ArticleScreen
    is ScreenModel.UserScreenModel -> Screen.UserScreen
    is ScreenModel.CommentScreenModel -> Screen.CommentScreen
    is ScreenModel.VisitorScreenModel -> Screen.VisitorScreen
    ScreenModel.SettingScreenModel -> Screen.SettingScreen
    ScreenModel.NotFoundScreenModel -> Screen.NotFoundScreen
  }

fun withScreenModel(model: Model, screenModel: CurrentScreenModel): Model = model.copy(screenModel = screenModel)
