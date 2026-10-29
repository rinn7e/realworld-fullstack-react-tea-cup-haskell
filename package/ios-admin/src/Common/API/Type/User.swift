// Module: Common_API_Type

public enum UserSortAttr: String, Equatable, CaseIterable {
  case id
  case username
  case email
}

public struct AdminUser: Equatable, Decodable, Identifiable {
  public let id: Int
  public let username: String
  public let email: String
  public let bio: String?
  public let image: String?
  public let role: String
}

public struct AdminUserListResponse: Equatable, Decodable {
  public let users: [AdminUser]
  public let totalCount: Int
}

public struct LoginRequest: Encodable {
  public struct User: Encodable {
    public let email: String
    public let password: String

    public init(email: String, password: String) {
      self.email = email
      self.password = password
    }
  }

  public let user: User

  public init(user: User) {
    self.user = user
  }
}

public struct UserResponse: Equatable, Decodable {
  public struct User: Equatable, Decodable {
    public let email: String
    public let token: String
    public let username: String
    public let bio: String?
    public let image: String?
  }

  public let user: User
}
