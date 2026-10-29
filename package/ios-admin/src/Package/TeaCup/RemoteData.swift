// Module: Package_TeaCup

/// Data from a server, like `RemoteData` of remote-data-ts.
public enum RemoteData<E, A> {
  case initial
  case pending
  case failure(E)
  case success(A)

  /// Like `resultToRd` of tea-cup-prelude
  public init(_ result: Result<A, E>) where E: Error {
    switch result {
    case .success(let value): self = .success(value)
    case .failure(let error): self = .failure(error)
    }
  }

  public func map<B>(_ transform: (A) -> B) -> RemoteData<E, B> {
    switch self {
    case .initial: .initial
    case .pending: .pending
    case .failure(let error): .failure(error)
    case .success(let value): .success(transform(value))
    }
  }

  public var isPending: Bool {
    if case .pending = self { true } else { false }
  }
}

extension RemoteData: Equatable where E: Equatable, A: Equatable {}
