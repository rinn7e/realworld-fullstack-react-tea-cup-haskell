// Module: Screen_HomeScreen_SubComponent_StatCard

import SwiftUI

@_spi(Screen_HomeScreen) public struct StatCard: View, Equatable {
  let label: String
  let value: String
  let systemImage: String
  let color: Color

  public var body: some View {
    VStack(alignment: .leading, spacing: 8) {
      Image(systemName: systemImage)
        .font(.title3)
        .foregroundStyle(color)
      Text(value)
        .font(.title.bold())
        .monospacedDigit()
        .contentTransition(.numericText())
      Text(label)
        .font(.footnote)
        .foregroundStyle(.secondary)
    }
    .frame(maxWidth: .infinity, alignment: .leading)
    .padding(16)
    .background(Color(.secondarySystemGroupedBackground), in: RoundedRectangle(cornerRadius: 16))
    .accessibilityElement(children: .combine)
  }

  @_spi(Screen_HomeScreen) public init(label: String, value: String, systemImage: String, color: Color) {
    self.label = label
    self.value = value
    self.systemImage = systemImage
    self.color = color
  }
}
