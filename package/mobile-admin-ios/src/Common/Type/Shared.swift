// Module: Common_Type_Shared

@_spi(Common_Type) import Common_Type_AuthUser

public struct Shared: Equatable {
  public var user: AuthUser?
  public var token: String?

  public init(user: AuthUser?, token: String?) {
    self.user = user
    self.token = token
  }
}
