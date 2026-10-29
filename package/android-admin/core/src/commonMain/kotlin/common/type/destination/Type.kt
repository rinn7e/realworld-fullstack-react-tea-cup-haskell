package common.type.destination

// The screen a destination shows. None of the admin screens has a param.
enum class Screen {
  HomeScreen,
  LoginScreen,
  ArticleScreen,
  UserScreen,
  CommentScreen,
  VisitorScreen,
  SettingScreen,
  NotFoundScreen,
}

// Where the app is. Never stored: read from the models that show it
// (`destinationOf`). A destination the guard let through is a
// `DestinationAfterGuard`, declared next to the guard that owns it
// (`app/util/Guard.kt`).
data class Destination(val screen: Screen)

fun destinationOfScreen(screen: Screen): Destination = Destination(screen)

fun defaultDestination(): Destination = destinationOfScreen(Screen.HomeScreen)

fun loginDestination(): Destination = destinationOfScreen(Screen.LoginScreen)

// Every move of the app goes through `navigationMsgHandler`. `UrlChanged` is a
// deep link, the only move that comes from a URL after the boot.
sealed interface NavigationMsg {
  data class Navigate(val destination: Destination, val forceRefresh: Boolean = false) : NavigationMsg

  data class ModifyDestination(val transform: (Destination) -> Destination, val forceRefresh: Boolean = false) :
    NavigationMsg

  data object Refresh : NavigationMsg

  data class UrlChanged(val destination: Destination) : NavigationMsg
}
