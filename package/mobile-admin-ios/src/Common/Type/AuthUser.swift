// Module: Common_Type_AuthUser

public struct AuthUser: Equatable {
  public let username: String
  public let email: String
  public let token: String
  public let bio: String?
  public let image: String?

  public init(username: String, email: String, token: String, bio: String?, image: String?) {
    self.username = username
    self.email = email
    self.token = token
    self.bio = bio
    self.image = image
  }
}
