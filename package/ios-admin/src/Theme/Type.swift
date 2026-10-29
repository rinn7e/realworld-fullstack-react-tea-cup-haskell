// Module: Theme

import SwiftUI

public struct Theme: Equatable, Identifiable {
  public let id: String
  public let name: String
  public let primaryColor: Color
  public let secondaryColor: Color

  // Themes are static presets, so the id identifies one
  public static func == (lhs: Theme, rhs: Theme) -> Bool { lhs.id == rhs.id }

  // Nested: a top-level `ColorScheme` of this module would be ambiguous with
  // the one of SwiftUI in every file that imports both
  public enum ColorScheme: String, Equatable, CaseIterable {
    case light
    case dark
    case auto
  }
}
