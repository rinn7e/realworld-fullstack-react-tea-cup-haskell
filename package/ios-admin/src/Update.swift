// Module: SentinelAdmin

import Common_API_Handler
import Common_API_Type
import Common_Cache
import Common_Type
import Common_Type_Destination
import Package_TeaCup
import Screen_ArticleScreen
import Screen_CommentScreen
import Screen_HomeScreen
import Screen_LoginScreen
import Screen_SettingScreen
import Screen_UserScreen
import Screen_VisitorScreen
import Theme

// Initialization
// ---------------------------------------------

func initialModel(
  _ bootDestination: Destination,
  user: AuthUser?,
  isUnavailable: Bool,
  token: String?
) -> (Model, Cmd<Msg>) {
  // The stored token is not touched here: `initializeCmd` already saved or
  // removed it from the server's answer.
  let shared = Shared(user: user, token: token)
  let destination = guardDestination(shared, bootDestination)
  let (screenModel, screenCmd) = initScreenModel(destination, shared)
  let theme = loadThemeId().flatMap { id in themes.first { $0.id == id } } ?? defaultTheme

  let model = Model(
    screenModel: screenModel,
    shared: shared,
    theme: theme,
    colorScheme: loadColorScheme()
  )
  return (model, screenCmd)
}

// Checks the stored token with the server before the app is built. A server
// that cannot answer (unavailable) keeps the token, so the app opens on it.
func initializeCmd() -> Cmd<Msg> {
  Cmd { dispatch in
    guard let storedToken = getToken() else {
      dispatch(.initialize(user: nil, isUnavailable: false, token: nil))
      return
    }
    let res = await getCurrentUser(storedToken)
    let isUnavailable =
      if case .failure(let err) = res { [500, 0, 200].contains(err.statusCode) } else { false }

    let token: String? =
      switch res {
      case .success(let value): value.user.token
      case .failure: isUnavailable ? storedToken : nil
      }

    if let token { saveToken(token) } else { removeToken() }

    let user: AuthUser? =
      switch res {
      case .success(let value): authUserOf(value)
      case .failure: nil
      }
    dispatch(.initialize(user: user, isUnavailable: isUnavailable, token: token))
  }
}

private func authUserOf(_ response: UserResponse) -> AuthUser {
  AuthUser(
    username: response.user.username,
    email: response.user.email,
    token: response.user.token,
    bio: response.user.bio,
    image: response.user.image
  )
}

func update(_ msg: Msg, _ model: Model) -> (Model, Cmd<Msg>) {
  switch msg {
  case .navigationMsg(let subMsg):
    return navigationMsgHandler(subMsg, model)
  case .initialize:
    // Handled before the model exists (`Program.swift`)
    return (model, .none)
  case .homeScreenMsg(let subMsg):
    return homeScreenMsgHandler(subMsg, model)
  case .loginScreenMsg(let subMsg):
    return loginScreenMsgHandler(subMsg, model)
  case .articleScreenMsg(let subMsg):
    return articleScreenMsgHandler(subMsg, model)
  case .userScreenMsg(let subMsg):
    return userScreenMsgHandler(subMsg, model)
  case .commentScreenMsg(let subMsg):
    return commentScreenMsgHandler(subMsg, model)
  case .visitorScreenMsg(let subMsg):
    return visitorScreenMsgHandler(subMsg, model)
  case .settingScreenMsg(let subMsg):
    return settingScreenMsgHandler(subMsg, model)
  case .noOp:
    return (model, .none)
  }
}

// Handlers
// ---------------------------------------------

private func settingScreenMsgHandler(_ subMsg: SettingScreenMsg, _ model: Model) -> (Model, Cmd<Msg>) {
  switch subMsg {
  case .logout:
    return logoutHandler(model)
  case .switchTheme(let theme):
    return switchThemeHandler(theme, model)
  case .setColorScheme(let scheme):
    return setColorSchemeHandler(scheme, model)
  }
}

private func logoutHandler(_ model: Model) -> (Model, Cmd<Msg>) {
  var updatedModel = model
  updatedModel.shared = Shared(user: nil, token: nil)
  let (navigatedModel, navigationCmd) = navigationMsgHandler(.navigate(loginDestination()), updatedModel)
  return (navigatedModel, .batch([Cmd { _ in removeToken() }, navigationCmd]))
}

private func homeScreenMsgHandler(_ subMsg: HomeScreenMsg, _ model: Model) -> (Model, Cmd<Msg>) {
  guard case .homeScreenModel(let screenModel) = model.screenModel.screenModel else { return (model, .none) }
  let (m, c) = homeScreenUpdate(model.shared)(subMsg, screenModel)
  return (withScreenModel(model, model.screenModel.sameScreenWith(.homeScreenModel(m))), c.map(Msg.homeScreenMsg))
}

private func loginScreenMsgHandler(_ subMsg: LoginScreenMsg, _ model: Model) -> (Model, Cmd<Msg>) {
  guard case .loginScreenModel(let screenModel) = model.screenModel.screenModel else { return (model, .none) }
  let (m, c) = loginScreenUpdate(subMsg, screenModel)
  let nextModel = withScreenModel(model, model.screenModel.sameScreenWith(.loginScreenModel(m)))
  let nextCmd = c.map(Msg.loginScreenMsg)

  if case .submitResult(.success(let response)) = subMsg {
    var updatedModel = nextModel
    updatedModel.shared.user = authUserOf(response)
    updatedModel.shared.token = response.user.token
    let (navigatedModel, navigationCmd) = navigationMsgHandler(.navigate(defaultDestination()), updatedModel)
    let token = response.user.token
    return (navigatedModel, .batch([nextCmd, Cmd { _ in saveToken(token) }, navigationCmd]))
  } else {
    return (nextModel, nextCmd)
  }
}

private func articleScreenMsgHandler(_ subMsg: ArticleScreenMsg, _ model: Model) -> (Model, Cmd<Msg>) {
  guard case .articleScreenModel(let screenModel) = model.screenModel.screenModel else { return (model, .none) }
  let (m, c) = articleScreenUpdate(model.shared)(subMsg, screenModel)
  return (withScreenModel(model, model.screenModel.sameScreenWith(.articleScreenModel(m))), c.map(Msg.articleScreenMsg))
}

private func userScreenMsgHandler(_ subMsg: UserScreenMsg, _ model: Model) -> (Model, Cmd<Msg>) {
  guard case .userScreenModel(let screenModel) = model.screenModel.screenModel else { return (model, .none) }
  let (m, c) = userScreenUpdate(model.shared)(subMsg, screenModel)
  return (withScreenModel(model, model.screenModel.sameScreenWith(.userScreenModel(m))), c.map(Msg.userScreenMsg))
}

private func commentScreenMsgHandler(_ subMsg: CommentScreenMsg, _ model: Model) -> (Model, Cmd<Msg>) {
  guard case .commentScreenModel(let screenModel) = model.screenModel.screenModel else { return (model, .none) }
  let (m, c) = commentScreenUpdate(model.shared)(subMsg, screenModel)
  return (withScreenModel(model, model.screenModel.sameScreenWith(.commentScreenModel(m))), c.map(Msg.commentScreenMsg))
}

private func visitorScreenMsgHandler(_ subMsg: VisitorScreenMsg, _ model: Model) -> (Model, Cmd<Msg>) {
  guard case .visitorScreenModel(let screenModel) = model.screenModel.screenModel else { return (model, .none) }
  let (m, c) = visitorScreenUpdate(model.shared)(subMsg, screenModel)
  return (withScreenModel(model, model.screenModel.sameScreenWith(.visitorScreenModel(m))), c.map(Msg.visitorScreenMsg))
}

private func switchThemeHandler(_ theme: Theme, _ model: Model) -> (Model, Cmd<Msg>) {
  var updatedModel = model
  updatedModel.theme = theme
  return (updatedModel, Cmd { _ in saveTheme(theme) })
}

private func setColorSchemeHandler(_ scheme: Theme.ColorScheme, _ model: Model) -> (Model, Cmd<Msg>) {
  var updatedModel = model
  updatedModel.colorScheme = scheme
  return (updatedModel, Cmd { _ in saveColorScheme(scheme) })
}
