package app

import app.handler.initScreenModel
import app.handler.navigationMsgHandler
import app.util.guardDestination
import common.api.handler.getCurrentUser
import common.api.type.UserResponse
import common.cache.getToken
import common.cache.removeToken
import common.cache.saveToken
import common.type.AuthUser
import common.type.Shared
import common.type.destination.Destination
import common.type.destination.NavigationMsg
import common.type.destination.defaultDestination
import common.type.destination.loginDestination
import teacup.Cmd
import teacup.Either
import theme.Theme
import theme.loadColorScheme
import theme.loadThemeId
import theme.saveColorScheme
import theme.saveTheme
import theme.themeOfId
import screen.articlescreen.update as articleScreenUpdate
import screen.commentscreen.update as commentScreenUpdate
import screen.homescreen.update as homeScreenUpdate
import screen.loginscreen.update as loginScreenUpdate
import screen.userscreen.update as userScreenUpdate
import screen.visitorscreen.update as visitorScreenUpdate

// Initialization
// ---------------------------------------------

fun initialModel(bootDestination: Destination, initialize: Msg.Initialize): Pair<Model, Cmd<Msg>> {
  // The stored token is not touched here: `initializeCmd` already saved or
  // removed it from the server's answer.
  val shared = Shared(user = initialize.user, token = initialize.token)
  val destination = guardDestination(shared, bootDestination)
  val (screenModel, screenCmd) = initScreenModel(destination, shared)
  val model = Model(screenModel = screenModel, shared = shared, theme = initialize.theme, colorScheme = initialize.colorScheme)
  return model to screenCmd
}

// Checks the stored token with the server before the app is built. A server
// that cannot answer (unavailable) keeps the token, so the app opens on it.
fun initializeCmd(): Cmd<Msg> =
  Cmd { dispatch ->
    val theme = themeOfId(loadThemeId())
    val colorScheme = loadColorScheme()
    val storedToken = getToken()
    if (storedToken == null) {
      dispatch(Msg.Initialize(user = null, isUnavailable = false, token = null, theme = theme, colorScheme = colorScheme))
    } else {
      val res = getCurrentUser(storedToken)
      val isUnavailable = res is Either.Left && res.value.statusCode in listOf(500, 0, 200)
      val token =
        when (res) {
          is Either.Right -> res.value.user.token
          is Either.Left -> if (isUnavailable) storedToken else null
        }
      if (token != null) saveToken(token) else removeToken()
      val user = (res as? Either.Right)?.let { authUserOf(it.value) }
      dispatch(Msg.Initialize(user = user, isUnavailable = isUnavailable, token = token, theme = theme, colorScheme = colorScheme))
    }
  }

private fun authUserOf(response: UserResponse): AuthUser =
  AuthUser(
    username = response.user.username,
    email = response.user.email,
    token = response.user.token,
    bio = response.user.bio,
    image = response.user.image,
  )

fun update(msg: Msg, model: Model): Pair<Model, Cmd<Msg>> =
  when (msg) {
    is Msg.NavigationMsg -> navigationMsgHandler(msg.msg, model)
    // Handled before the model exists (`Program.kt`)
    is Msg.Initialize -> model to Cmd.none
    is Msg.HomeScreenMsg -> homeScreenMsgHandler(msg.msg, model)
    is Msg.LoginScreenMsg -> loginScreenMsgHandler(msg.msg, model)
    is Msg.ArticleScreenMsg -> articleScreenMsgHandler(msg.msg, model)
    is Msg.UserScreenMsg -> userScreenMsgHandler(msg.msg, model)
    is Msg.CommentScreenMsg -> commentScreenMsgHandler(msg.msg, model)
    is Msg.VisitorScreenMsg -> visitorScreenMsgHandler(msg.msg, model)
    is Msg.SettingScreenMsg -> settingScreenMsgHandler(msg.msg, model)
    Msg.NoOp -> model to Cmd.none
  }

// Handlers
// ---------------------------------------------

private fun settingScreenMsgHandler(subMsg: screen.settingscreen.Msg, model: Model): Pair<Model, Cmd<Msg>> =
  when (subMsg) {
    screen.settingscreen.Msg.Logout -> logoutHandler(model)
    is screen.settingscreen.Msg.SwitchTheme -> switchThemeHandler(subMsg.theme, model)
    is screen.settingscreen.Msg.SetColorScheme -> setColorSchemeHandler(subMsg.scheme, model)
  }

private fun logoutHandler(model: Model): Pair<Model, Cmd<Msg>> {
  val updatedModel = model.copy(shared = Shared(user = null, token = null))
  val (navigatedModel, navigationCmd) = navigationMsgHandler(NavigationMsg.Navigate(loginDestination()), updatedModel)
  return navigatedModel to Cmd.batch(Cmd { removeToken() }, navigationCmd)
}

private fun homeScreenMsgHandler(subMsg: screen.homescreen.Msg, model: Model): Pair<Model, Cmd<Msg>> {
  val screenModel = (model.screenModel.screenModel as? ScreenModel.HomeScreenModel)?.model ?: return model to Cmd.none
  val (m, c) = homeScreenUpdate(model.shared, subMsg, screenModel)
  return withScreenModel(model, model.screenModel.sameScreenWith(ScreenModel.HomeScreenModel(m))) to c.map(Msg::HomeScreenMsg)
}

private fun loginScreenMsgHandler(subMsg: screen.loginscreen.Msg, model: Model): Pair<Model, Cmd<Msg>> {
  val screenModel = (model.screenModel.screenModel as? ScreenModel.LoginScreenModel)?.model ?: return model to Cmd.none
  val (m, c) = loginScreenUpdate(subMsg, screenModel)
  val nextModel = withScreenModel(model, model.screenModel.sameScreenWith(ScreenModel.LoginScreenModel(m)))
  val nextCmd = c.map(Msg::LoginScreenMsg)

  val result = (subMsg as? screen.loginscreen.Msg.SubmitResult)?.result
  return if (result is Either.Right) {
    val response = result.value
    val updatedModel = nextModel.copy(shared = Shared(user = authUserOf(response), token = response.user.token))
    val (navigatedModel, navigationCmd) = navigationMsgHandler(NavigationMsg.Navigate(defaultDestination()), updatedModel)
    val token = response.user.token
    navigatedModel to Cmd.batch(nextCmd, Cmd { saveToken(token) }, navigationCmd)
  } else {
    nextModel to nextCmd
  }
}

private fun articleScreenMsgHandler(subMsg: screen.articlescreen.Msg, model: Model): Pair<Model, Cmd<Msg>> {
  val screenModel = (model.screenModel.screenModel as? ScreenModel.ArticleScreenModel)?.model ?: return model to Cmd.none
  val (m, c) = articleScreenUpdate(model.shared, subMsg, screenModel)
  return withScreenModel(model, model.screenModel.sameScreenWith(ScreenModel.ArticleScreenModel(m))) to c.map(Msg::ArticleScreenMsg)
}

private fun userScreenMsgHandler(subMsg: screen.userscreen.Msg, model: Model): Pair<Model, Cmd<Msg>> {
  val screenModel = (model.screenModel.screenModel as? ScreenModel.UserScreenModel)?.model ?: return model to Cmd.none
  val (m, c) = userScreenUpdate(model.shared, subMsg, screenModel)
  return withScreenModel(model, model.screenModel.sameScreenWith(ScreenModel.UserScreenModel(m))) to c.map(Msg::UserScreenMsg)
}

private fun commentScreenMsgHandler(subMsg: screen.commentscreen.Msg, model: Model): Pair<Model, Cmd<Msg>> {
  val screenModel = (model.screenModel.screenModel as? ScreenModel.CommentScreenModel)?.model ?: return model to Cmd.none
  val (m, c) = commentScreenUpdate(model.shared, subMsg, screenModel)
  return withScreenModel(model, model.screenModel.sameScreenWith(ScreenModel.CommentScreenModel(m))) to c.map(Msg::CommentScreenMsg)
}

private fun visitorScreenMsgHandler(subMsg: screen.visitorscreen.Msg, model: Model): Pair<Model, Cmd<Msg>> {
  val screenModel = (model.screenModel.screenModel as? ScreenModel.VisitorScreenModel)?.model ?: return model to Cmd.none
  val (m, c) = visitorScreenUpdate(model.shared, subMsg, screenModel)
  return withScreenModel(model, model.screenModel.sameScreenWith(ScreenModel.VisitorScreenModel(m))) to c.map(Msg::VisitorScreenMsg)
}

private fun switchThemeHandler(theme: Theme, model: Model): Pair<Model, Cmd<Msg>> =
  model.copy(theme = theme) to Cmd { saveTheme(theme) }

private fun setColorSchemeHandler(scheme: Theme.ColorScheme, model: Model): Pair<Model, Cmd<Msg>> =
  model.copy(colorScheme = scheme) to Cmd { saveColorScheme(scheme) }
