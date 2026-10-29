import SwiftUI

struct Theme: Equatable, Identifiable {
  let id: String
  let name: String
  let primaryColor: Color
  let secondaryColor: Color

  // Themes are static presets, so the id identifies one
  static func == (lhs: Theme, rhs: Theme) -> Bool { lhs.id == rhs.id }
}

enum ColorScheme: String, Equatable, CaseIterable {
  case light
  case dark
  case auto
}
