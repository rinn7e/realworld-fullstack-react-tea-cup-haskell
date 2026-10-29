import SwiftUI

/// The edit buffer of a text input with `value` and `onInput`, like a DOM input
/// holds its own text. A binding that reads the model would read the value of
/// the last render, and fast typing would reset the text and move the cursor.
/// Every edit is sent, and a `value` the input did not send (a reset of the form)
/// replaces the buffer. A render can come with an older value than the buffer
/// while the user types, so the values sent and not seen back yet are kept.
public struct InputBuffer {
  public private(set) var text: String
  private var sent: [String] = []

  public init(_ value: String) {
    text = value
  }

  /// An edit of the user: the text to send, or nil when it was sent already
  public mutating func edit(_ newText: String) -> String? {
    text = newText
    guard newText != sent.last else { return nil }
    sent.append(newText)
    return newText
  }

  /// A new value from the model
  public mutating func receive(_ value: String) {
    if let index = sent.firstIndex(of: value) {
      sent.removeFirst(index + 1)
    } else if value != text {
      sent = []
      text = value
    }
  }
}

/// A binding over a buffer that sends every edit from its setter: an `onChange`
/// of the buffer drops the last edits of fast typing.
public func bufferBinding(_ buffer: Binding<InputBuffer>, onInput: @escaping (String) -> Void) -> Binding<String> {
  Binding(
    get: { buffer.wrappedValue.text },
    set: { newText in
      if let sent = buffer.wrappedValue.edit(newText) { onInput(sent) }
    }
  )
}

/// A text input with `value` and `onInput`, like `input` with `onChange`.
public struct InputView: View {
  public enum Kind {
    case line
    case secure
  }

  let label: String
  let value: String
  let kind: Kind
  let onInput: (String) -> Void
  @State private var buffer: InputBuffer

  public init(_ label: String, value: String, kind: Kind = .line, onInput: @escaping (String) -> Void) {
    self.label = label
    self.value = value
    self.kind = kind
    self.onInput = onInput
    _buffer = State(initialValue: InputBuffer(value))
  }

  public var body: some View {
    let text = bufferBinding($buffer, onInput: onInput)
    Group {
      switch kind {
      case .line: TextField(label, text: text)
      case .secure: SecureField(label, text: text)
      }
    }
    .onChange(of: value) { _, newValue in buffer.receive(newValue) }
  }
}
