enum UserSortAttr: String, Equatable, CaseIterable {
  case id
  case username
  case email
}

struct AdminUser: Equatable, Decodable, Identifiable {
  let id: Int
  let username: String
  let email: String
  let bio: String?
  let image: String?
  let role: String
}

struct AdminUserListResponse: Equatable, Decodable {
  let users: [AdminUser]
  let totalCount: Int
}

struct LoginRequest: Encodable {
  struct User: Encodable {
    let email: String
    let password: String
  }

  let user: User
}

struct UserResponse: Equatable, Decodable {
  struct User: Equatable, Decodable {
    let email: String
    let token: String
    let username: String
    let bio: String?
    let image: String?
  }

  let user: User
}
