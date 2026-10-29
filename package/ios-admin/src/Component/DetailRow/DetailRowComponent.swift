import SwiftUI

/// A label and its value in a detail sheet, the value selectable for copying
public struct DetailRowComponent: View, Equatable {
  let label: String
  let value: String
  let isMono: Bool

  public init(label: String, value: String, isMono: Bool) {
    self.label = label
    self.value = value
    self.isMono = isMono
  }

  public var body: some View {
    LabeledContent(label) {
      Text(value)
        .font(isMono ? .body.monospaced() : .body)
        .multilineTextAlignment(.trailing)
        .textSelection(.enabled)
    }
  }
}
