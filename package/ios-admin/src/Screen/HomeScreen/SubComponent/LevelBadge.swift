// Module: Screen_HomeScreen_SubComponent_LevelBadge

import Common_API_Type_Dashboard
import SwiftUI

@_spi(Screen_HomeScreen) public struct LevelBadge: View, Equatable {
  let level: LogLevel

  public var body: some View {
    Text(level.rawValue)
      .font(.caption2.bold())
      .foregroundStyle(levelColor(level))
      .padding(.horizontal, 8)
      .padding(.vertical, 2)
      .background(levelColor(level).opacity(0.15), in: Capsule())
  }

  @_spi(Screen_HomeScreen) public init(level: LogLevel) {
    self.level = level
  }
}

func levelColor(_ level: LogLevel) -> Color {
  switch level {
  case .ERROR: .red
  case .WARNING: .orange
  case .INFO: .blue
  case .DEBUG: .gray
  }
}
