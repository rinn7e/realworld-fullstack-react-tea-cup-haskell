// Module: Package_TeaCup_Dispatcher

/// Sends a message to the runtime, like `Dispatcher` of tea-cup-fp.
///
/// Every dispatcher is equal to every other one, like `EqAlways` on the
/// `dispatch` prop: a view that takes one can still be `Equatable`, so SwiftUI
/// skips its body when the rest of its input did not change (the `memo` of the
/// web views).
public struct Dispatcher<Msg>: Equatable {
  private let send: @MainActor (Msg) -> Void

  public init(_ send: @escaping @MainActor (Msg) -> Void) {
    self.send = send
  }

  @MainActor
  public func callAsFunction(_ msg: Msg) {
    send(msg)
  }

  /// A dispatcher for a child, like `(subMsg) => dispatch({ _tag: 'XMsg', subMsg })`
  public func map<Child>(_ toMsg: @escaping (Child) -> Msg) -> Dispatcher<Child> {
    Dispatcher<Child> { child in send(toMsg(child)) }
  }

  public static func == (lhs: Dispatcher, rhs: Dispatcher) -> Bool { true }
}
