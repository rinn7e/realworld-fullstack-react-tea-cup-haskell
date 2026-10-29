import app.Model
import app.Msg
import app.ScreenModel
import app.currentScreenOf
import app.handler.initScreenModel
import app.handler.navigationMsgHandler
import app.util.guardDestination
import common.type.AuthUser
import common.type.Shared
import common.type.destination.NavigationMsg
import common.type.destination.Screen
import common.type.destination.destinationOfScreen
import common.type.destination.parseDestination
import common.type.destination.toUrlString
import theme.Theme
import theme.defaultTheme
import kotlin.test.Test
import kotlin.test.assertEquals

class NavigationTest {
  private val signedIn = Shared(AuthUser("jake", "jake@example.com", "t", null, null), "t")
  private val signedOut = Shared(user = null, token = null)

  private fun modelOn(screen: Screen, shared: Shared): Model {
    val (screenModel, _) = initScreenModel(guardDestination(shared, destinationOfScreen(screen)), shared)
    return Model(screenModel, shared, defaultTheme, Theme.ColorScheme.Auto)
  }

  private fun screenOf(model: Model) = currentScreenOf(model.screenModel.screenModel)

  @Test
  fun parsesDeepLinks() {
    assertEquals(Screen.UserScreen, parseDestination("sentinel://users").screen)
    assertEquals(Screen.HomeScreen, parseDestination("sentinel://").screen)
    assertEquals(Screen.SettingScreen, parseDestination("sentinel://settings/?x=1").screen)
    assertEquals(Screen.NotFoundScreen, parseDestination("sentinel://nope").screen)
  }

  @Test
  fun everyScreenRoundTripsThroughItsUrl() {
    for (screen in Screen.entries - Screen.NotFoundScreen) {
      assertEquals(screen, parseDestination(toUrlString(destinationOfScreen(screen))).screen)
    }
  }

  @Test
  fun signedOutGoesToLogin() {
    assertEquals(Screen.LoginScreen, guardDestination(signedOut, destinationOfScreen(Screen.UserScreen)).destination.screen)
  }

  @Test
  fun signedInSkipsLogin() {
    assertEquals(Screen.HomeScreen, guardDestination(signedIn, destinationOfScreen(Screen.LoginScreen)).destination.screen)
  }

  @Test
  fun aKeptTokenOpensTheAppWhileTheServerIsDown() {
    val unavailable = Shared(user = null, token = "t")
    assertEquals(Screen.UserScreen, guardDestination(unavailable, destinationOfScreen(Screen.UserScreen)).destination.screen)
  }

  @Test
  fun navigateOpensTheScreen() {
    val (next, _) = navigationMsgHandler(NavigationMsg.Navigate(destinationOfScreen(Screen.VisitorScreen)), modelOn(Screen.HomeScreen, signedIn))
    assertEquals(Screen.VisitorScreen, screenOf(next))
  }

  @Test
  fun deepLinkToTheScreenShownIsDropped() {
    val model = modelOn(Screen.UserScreen, signedIn)
    val (next, _) = navigationMsgHandler(NavigationMsg.UrlChanged(destinationOfScreen(Screen.UserScreen)), model)
    assertEquals(model, next)
  }

  @Test
  fun aScreenMessageNeverChangesTheScreen() {
    val model = modelOn(Screen.HomeScreen, signedIn)
    val other = (modelOn(Screen.UserScreen, signedIn).screenModel.screenModel as ScreenModel.UserScreenModel)
    assertEquals(model.screenModel, model.screenModel.sameScreenWith(other))
  }

  @Test
  fun logoutGoesToLogin() {
    val (next, _) = app.update(Msg.SettingScreenMsg(screen.settingscreen.Msg.Logout), modelOn(Screen.HomeScreen, signedIn))
    assertEquals(Screen.LoginScreen, screenOf(next))
    assertEquals(signedOut, next.shared)
  }
}
