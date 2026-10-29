import SwiftUI

/// A label and its value in a detail sheet, the value selectable for copying
struct DetailRowView: View, Equatable {
  let label: String
  let value: String
  let isMono: Bool

  var body: some View {
    LabeledContent(label) {
      Text(value)
        .font(isMono ? .body.monospaced() : .body)
        .multilineTextAlignment(.trailing)
        .textSelection(.enabled)
    }
  }
}
