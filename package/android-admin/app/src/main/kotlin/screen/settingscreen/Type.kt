package screen.settingscreen

import theme.Theme

// What the settings ask of the app. The screen has no model of its own (the
// web screen dispatches the root messages), so its messages are its own, and
// the app maps them.
sealed interface Msg {
  data object Logout : Msg

  data class SwitchTheme(val theme: Theme) : Msg

  data class SetColorScheme(val scheme: Theme.ColorScheme) : Msg
}
