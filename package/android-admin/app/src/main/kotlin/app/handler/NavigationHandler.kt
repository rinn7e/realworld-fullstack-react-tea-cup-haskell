package app.handler

import app.CurrentScreenModel
import app.Model
import app.Msg
import app.ScreenModel
import app.util.DestinationAfterGuard
import app.util.destinationOf
import app.util.guardDestination
import app.withScreenModel
import common.type.Shared
import common.type.destination.Destination
import common.type.destination.NavigationMsg
import common.type.destination.Screen
import teacup.Cmd
import screen.articlescreen.initial as articleScreenInitial
import screen.commentscreen.initial as commentScreenInitial
import screen.homescreen.initial as homeScreenInitial
import screen.loginscreen.initial as loginScreenInitial
import screen.userscreen.initial as userScreenInitial
import screen.visitorscreen.initial as visitorScreenInitial

// The screen model of `destination`, the one place a move opens a screen. Every
// move opens its screen afresh: no admin screen keeps state across a move.
// Review: called only by `navigateHandler` and the boot, after the guard.
fun initScreenModel(destination: DestinationAfterGuard, shared: Shared): Pair<CurrentScreenModel, Cmd<Msg>> {
  val (screenModel, cmd) = freshScreenModelOf(destination.destination, shared)
  return CurrentScreenModel.ofMove(destination, screenModel) to cmd
}

private fun freshScreenModelOf(destination: Destination, shared: Shared): Pair<ScreenModel, Cmd<Msg>> =
  when (destination.screen) {
    Screen.HomeScreen ->
      homeScreenInitial(shared).let { (m, c) -> ScreenModel.HomeScreenModel(m) to c.map(Msg::HomeScreenMsg) }

    Screen.LoginScreen ->
      loginScreenInitial().let { (m, c) -> ScreenModel.LoginScreenModel(m) to c.map(Msg::LoginScreenMsg) }

    Screen.ArticleScreen ->
      articleScreenInitial(shared).let { (m, c) -> ScreenModel.ArticleScreenModel(m) to c.map(Msg::ArticleScreenMsg) }

    Screen.UserScreen ->
      userScreenInitial(shared).let { (m, c) -> ScreenModel.UserScreenModel(m) to c.map(Msg::UserScreenMsg) }

    Screen.CommentScreen ->
      commentScreenInitial(shared).let { (m, c) -> ScreenModel.CommentScreenModel(m) to c.map(Msg::CommentScreenMsg) }

    Screen.VisitorScreen ->
      visitorScreenInitial(shared).let { (m, c) -> ScreenModel.VisitorScreenModel(m) to c.map(Msg::VisitorScreenMsg) }

    Screen.SettingScreen -> ScreenModel.SettingScreenModel to Cmd.none
    Screen.NotFoundScreen -> ScreenModel.NotFoundScreenModel to Cmd.none
  }

// Opens `destination` once the guard has passed it (or the destination it
// redirects to). A move to the destination shown is dropped when it comes from
// a URL (`isInternal` false), unless redirected or refreshed; the app's own
// moves always open it again (a tap on the tab shown refreshes it).
private fun navigateHandler(destination: Destination, isInternal: Boolean, forceRefresh: Boolean, model: Model): Pair<Model, Cmd<Msg>> {
  val guarded = guardDestination(model.shared, destination)
  val isRedirected = destination != guarded.destination
  return if (!isInternal && !isRedirected && !forceRefresh && destinationOf(model) == guarded.destination) {
    model to Cmd.none
  } else {
    val (screenModel, screenCmd) = initScreenModel(guarded, model.shared)
    withScreenModel(model, screenModel) to screenCmd
  }
}

// The destination a `NavigationMsg` moves to
private fun targetDestinationOf(subMsg: NavigationMsg, currentDestination: Destination): Destination =
  when (subMsg) {
    is NavigationMsg.Navigate -> subMsg.destination
    is NavigationMsg.ModifyDestination -> subMsg.transform(currentDestination)
    NavigationMsg.Refresh -> currentDestination
    is NavigationMsg.UrlChanged -> subMsg.destination
  }

// Every move of the app
fun navigationMsgHandler(subMsg: NavigationMsg, model: Model): Pair<Model, Cmd<Msg>> {
  val isInternal = subMsg !is NavigationMsg.UrlChanged
  val forceRefresh =
    when (subMsg) {
      NavigationMsg.Refresh -> true
      is NavigationMsg.Navigate -> subMsg.forceRefresh
      is NavigationMsg.ModifyDestination -> subMsg.forceRefresh
      is NavigationMsg.UrlChanged -> false
    }
  return navigateHandler(targetDestinationOf(subMsg, destinationOf(model)), isInternal, forceRefresh, model)
}
