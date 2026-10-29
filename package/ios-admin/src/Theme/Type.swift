// Module: Theme_Type

import SwiftUI

public struct Theme: Equatable, Identifiable {
  public let id: String
  public let name: String
  public let primaryColor: Color
  public let secondaryColor: Color

  // The presets are made in `Data.swift` only
  @_spi(Theme) public init(id: String, name: String, primaryColor: Color, secondaryColor: Color) {
    self.id = id
    self.name = name
    self.primaryColor = primaryColor
    self.secondaryColor = secondaryColor
  }

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
