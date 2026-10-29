import SwiftUI

struct StatCardView: View, Equatable {
  let label: String
  let value: String
  let systemImage: String
  let color: Color

  var body: some View {
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
}
