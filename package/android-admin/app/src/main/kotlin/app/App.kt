package app

import androidx.activity.compose.BackHandler
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.consumeWindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountCircle
import androidx.compose.material.icons.filled.BarChart
import androidx.compose.material.icons.filled.Description
import androidx.compose.material.icons.filled.Forum
import androidx.compose.material.icons.filled.Group
import androidx.compose.material.icons.filled.Public
import androidx.compose.material.icons.outlined.FolderOff
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import common.type.destination.NavigationMsg
import common.type.destination.Screen
import common.type.destination.destinationOfScreen
import screen.articlescreen.ArticleScreen
import screen.commentscreen.CommentScreen
import screen.homescreen.HomeScreen
import screen.loginscreen.LoginScreen
import screen.settingscreen.SettingScreen
import screen.userscreen.UserScreen
import screen.visitorscreen.VisitorScreen
import teacup.Dispatcher
import theme.AppTheme
import theme.defaultTheme

private data class Tab(val screen: Screen, val label: String, val icon: ImageVector)

private val tabs =
  listOf(
    Tab(Screen.HomeScreen, "Overview", Icons.Filled.BarChart),
    Tab(Screen.ArticleScreen, "Articles", Icons.Filled.Description),
    Tab(Screen.UserScreen, "Users", Icons.Filled.Group),
    Tab(Screen.CommentScreen, "Comments", Icons.Filled.Forum),
    Tab(Screen.VisitorScreen, "Visitors", Icons.Filled.Public),
  )

/** The program: a spinner while the boot checks the token, then the app */
@Composable
fun PreView(programModel: ProgramModel, dispatch: Dispatcher<Msg>) {
  when (programModel) {
    is ProgramModel.Booting ->
      AppTheme(defaultTheme, theme.Theme.ColorScheme.Auto) {
        Surface(Modifier.fillMaxSize()) { Box(contentAlignment = Alignment.Center) { CircularProgressIndicator() } }
      }

    is ProgramModel.Ready -> AppView(programModel.model, dispatch)
  }
}

/**
 * The app: the login screen alone when signed out, otherwise the screens as
 * tabs of a navigation bar (the sidebar of the web app). The selected tab is
 * read from the model, and choosing one is a move (`Navigate`), so every screen
 * opens afresh, as on the web. Settings is opened from the account button of
 * the top bar. Back goes to the overview, the start tab, and from there leaves
 * the app.
 */
@Composable
fun AppView(model: Model, dispatch: Dispatcher<Msg>) {
  val currentScreen = currentScreenOf(model.screenModel.screenModel)
  val navigate = { screen: Screen -> dispatch(navigationMsg(NavigationMsg.Navigate(destinationOfScreen(screen)))) }
  val accountButton = @Composable {
    IconButton(onClick = { navigate(Screen.SettingScreen) }) { Icon(Icons.Filled.AccountCircle, contentDescription = "Settings") }
  }

  AppTheme(model.theme, model.colorScheme) {
    BackHandler(enabled = currentScreen != Screen.HomeScreen && currentScreen != Screen.LoginScreen) { navigate(Screen.HomeScreen) }
    when (currentScreen) {
      Screen.LoginScreen, Screen.SettingScreen -> ScreenView(model, dispatch, accountButton, onBack = { navigate(Screen.HomeScreen) })
      Screen.NotFoundScreen -> NotFound(onHome = { navigate(Screen.HomeScreen) })
      else ->
        Scaffold(
          bottomBar = {
            NavigationBar {
              for (tab in tabs) {
                NavigationBarItem(
                  selected = tab.screen == currentScreen,
                  onClick = { navigate(tab.screen) },
                  icon = { Icon(tab.icon, contentDescription = null) },
                  label = { Text(tab.label) },
                )
              }
            }
          },
          contentWindowInsets = WindowInsets(0),
        ) { padding ->
          Box(Modifier.padding(padding).consumeWindowInsets(padding)) {
            ScreenView(model, dispatch, accountButton, onBack = { navigate(Screen.HomeScreen) })
          }
        }
    }
  }
}

@Composable
private fun ScreenView(model: Model, dispatch: Dispatcher<Msg>, accountButton: @Composable () -> Unit, onBack: () -> Unit) {
  when (val screenModel = model.screenModel.screenModel) {
    is ScreenModel.HomeScreenModel -> HomeScreen(screenModel.model, model.shared, dispatch.map(Msg::HomeScreenMsg), accountButton)
    is ScreenModel.ArticleScreenModel -> ArticleScreen(screenModel.model, model.shared, dispatch.map(Msg::ArticleScreenMsg), accountButton)
    is ScreenModel.UserScreenModel -> UserScreen(screenModel.model, model.shared, dispatch.map(Msg::UserScreenMsg), accountButton)
    is ScreenModel.CommentScreenModel -> CommentScreen(screenModel.model, model.shared, dispatch.map(Msg::CommentScreenMsg), accountButton)
    is ScreenModel.VisitorScreenModel -> VisitorScreen(screenModel.model, model.shared, dispatch.map(Msg::VisitorScreenMsg), accountButton)
    is ScreenModel.LoginScreenModel -> LoginScreen(screenModel.model, dispatch.map(Msg::LoginScreenMsg))
    ScreenModel.SettingScreenModel ->
      SettingScreen(model.shared.user, model.colorScheme, model.theme, dispatch.map(Msg::SettingScreenMsg), onBack)
    ScreenModel.NotFoundScreenModel -> NotFound(onHome = onBack)
  }
}

@Composable
private fun NotFound(onHome: () -> Unit) {
  Surface(Modifier.fillMaxSize()) {
    Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(16.dp, Alignment.CenterVertically)) {
      Icon(Icons.Outlined.FolderOff, contentDescription = null, Modifier.size(56.dp), tint = MaterialTheme.colorScheme.onSurfaceVariant)
      Text("404 Not Found", style = MaterialTheme.typography.headlineSmall)
      Button(onClick = onHome) { Text("Go to Overview") }
    }
  }
}
