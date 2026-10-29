// Module: Screen_SettingScreen_Type

import Theme_Type

// What the settings ask of the app. The screen has no model of its own (the
// web screen dispatches the root messages); a module cannot import the app
// that imports it, so its messages are its own, and the app maps them.
public enum SettingScreenMsg {
  case logout
  case switchTheme(Theme)
  case setColorScheme(Theme.ColorScheme)
}
