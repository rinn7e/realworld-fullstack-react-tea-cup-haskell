import Common
import TeaCup

// The screen model of `destination`, the one place a move opens a screen. Every
// move opens its screen afresh: no admin screen keeps state across a move.
// Review: called only by `navigateHandler` and the boot, after the guard.
func initScreenModel(_ destination: DestinationAfterGuard, _ shared: Shared) -> (CurrentScreenModel, Cmd<Msg>) {
  let (screenModel, cmd) = freshScreenModelOf(destination.destination, shared)
  return (CurrentScreenModel.ofMove(destination, screenModel), cmd)
}

private func freshScreenModelOf(_ destination: Destination, _ shared: Shared) -> (ScreenModel, Cmd<Msg>) {
  switch destination.screen {
  case .homeScreen:
    let (newModel, cmd) = HomeScreen.initial(shared)
    return (.homeScreenModel(newModel), cmd.map(Msg.homeScreenMsg))
  case .loginScreen:
    let (newModel, cmd) = LoginScreen.initial()
    return (.loginScreenModel(newModel), cmd.map(Msg.loginScreenMsg))
  case .articleScreen:
    let (newModel, cmd) = ArticleScreen.initial(shared)
    return (.articleScreenModel(newModel), cmd.map(Msg.articleScreenMsg))
  case .userScreen:
    let (newModel, cmd) = UserScreen.initial(shared)
    return (.userScreenModel(newModel), cmd.map(Msg.userScreenMsg))
  case .commentScreen:
    let (newModel, cmd) = CommentScreen.initial(shared)
    return (.commentScreenModel(newModel), cmd.map(Msg.commentScreenMsg))
  case .visitorScreen:
    let (newModel, cmd) = VisitorScreen.initial(shared)
    return (.visitorScreenModel(newModel), cmd.map(Msg.visitorScreenMsg))
  case .settingScreen:
    return (.settingScreenModel, .none)
  case .notFoundScreen:
    return (.notFoundScreenModel, .none)
  }
}

// Opens `destination` once the guard has passed it (or the destination it
// redirects to). A move to the destination shown is dropped when it comes from
// a URL (`isInternal` false), unless redirected or refreshed; the app's own
// moves always open it again (a tap on the tab shown refreshes it).
func navigateHandler(_ destination: Destination, isInternal: Bool, forceRefresh: Bool) -> (Model) -> (Model, Cmd<Msg>) {
  { model in
    let guarded = guardDestination(model.shared, destination)
    let isRedirected = destination != guarded.destination
    if !isInternal && !isRedirected && !forceRefresh && destinationOf(model) == guarded.destination {
      return (model, .none)
    } else {
      let (screenModel, screenCmd) = initScreenModel(guarded, model.shared)
      return (withScreenModel(model, screenModel), screenCmd)
    }
  }
}

// The destination a `NavigationMsg` moves to
private func targetDestinationOf(_ subMsg: NavigationMsg, _ currentDestination: Destination) -> Destination {
  switch subMsg {
  case .navigate(let destination, _): destination
  case .modifyDestination(let transform, _): transform(currentDestination)
  case .refresh: currentDestination
  case .urlChanged(let destination): destination
  }
}

// Every move of the app
func navigationMsgHandler(_ subMsg: NavigationMsg, _ model: Model) -> (Model, Cmd<Msg>) {
  let isInternal = if case .urlChanged = subMsg { false } else { true }
  let forceRefresh =
    switch subMsg {
    case .refresh: true
    case .navigate(_, let forceRefresh), .modifyDestination(_, let forceRefresh): forceRefresh
    case .urlChanged: false
    }
  return navigateHandler(targetDestinationOf(subMsg, destinationOf(model)), isInternal: isInternal, forceRefresh: forceRefresh)(model)
}
