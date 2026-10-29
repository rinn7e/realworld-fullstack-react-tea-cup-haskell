import CommonAPIType
import SwiftUI

extension HomeScreen.SubComponent {
  struct LevelBadge: View, Equatable {
    let level: LogLevel

    var body: some View {
      Text(level.rawValue)
        .font(.caption2.bold())
        .foregroundStyle(levelColor(level))
        .padding(.horizontal, 8)
        .padding(.vertical, 2)
        .background(levelColor(level).opacity(0.15), in: Capsule())
    }
  }

  static func levelColor(_ level: LogLevel) -> Color {
    switch level {
    case .ERROR: .red
    case .WARNING: .orange
    case .INFO: .blue
    case .DEBUG: .gray
    }
  }
}
