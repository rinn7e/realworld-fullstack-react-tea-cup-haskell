public struct Shared: Equatable {
  public var user: AuthUser?
  public var token: String?

  public init(user: AuthUser?, token: String?) {
    self.user = user
    self.token = token
  }
}
