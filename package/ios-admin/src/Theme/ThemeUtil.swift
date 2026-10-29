import SwiftUI

// The choices are kept in `UserDefaults` (the web app keeps them in
// `localStorage`). The loads run at boot, the saves in commands.

private let COLOR_SCHEME_KEY = "admin-color-scheme"
private let THEME_KEY = "admin-theme"

func loadColorScheme() -> ColorScheme {
  UserDefaults.standard.string(forKey: COLOR_SCHEME_KEY).flatMap(ColorScheme.init(rawValue:)) ?? .auto
}

func saveColorScheme(_ scheme: ColorScheme) {
  UserDefaults.standard.set(scheme.rawValue, forKey: COLOR_SCHEME_KEY)
}

func loadThemeId() -> String? {
  UserDefaults.standard.string(forKey: THEME_KEY)
}

func saveTheme(_ theme: Theme) {
  UserDefaults.standard.set(theme.id, forKey: THEME_KEY)
}

/// The scheme SwiftUI is asked for: nil follows the system, like `auto`
func preferredColorSchemeOf(_ scheme: ColorScheme) -> SwiftUI.ColorScheme? {
  switch scheme {
  case .light: .light
  case .dark: .dark
  case .auto: nil
  }
}
