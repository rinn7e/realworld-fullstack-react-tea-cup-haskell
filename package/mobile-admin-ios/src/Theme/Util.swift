// Module: Theme_Util

import SwiftUI
@_spi(Theme) import Theme_Type

// The choices are kept in `UserDefaults` (the web app keeps them in
// `localStorage`). The loads run at boot, the saves in commands.

private let COLOR_SCHEME_KEY = "admin-color-scheme"
private let THEME_KEY = "admin-theme"

public func loadColorScheme() -> Theme.ColorScheme {
  UserDefaults.standard.string(forKey: COLOR_SCHEME_KEY).flatMap(Theme.ColorScheme.init(rawValue:)) ?? .auto
}

public func saveColorScheme(_ scheme: Theme.ColorScheme) {
  UserDefaults.standard.set(scheme.rawValue, forKey: COLOR_SCHEME_KEY)
}

public func loadThemeId() -> String? {
  UserDefaults.standard.string(forKey: THEME_KEY)
}

public func saveTheme(_ theme: Theme) {
  UserDefaults.standard.set(theme.id, forKey: THEME_KEY)
}

/// The scheme SwiftUI is asked for: nil follows the system, like `auto`
public func preferredColorSchemeOf(_ scheme: Theme.ColorScheme) -> SwiftUI.ColorScheme? {
  switch scheme {
  case .light: .light
  case .dark: .dark
  case .auto: nil
  }
}
