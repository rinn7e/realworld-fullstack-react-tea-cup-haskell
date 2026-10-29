func login(_ request: LoginRequest) async -> Result<UserResponse, HttpError> {
  runApi(await fetchApi("/admin/login", method: "POST", body: request), decodeSuccess(UserResponse.self))
}

func getCurrentUser(_ token: String) async -> Result<UserResponse, HttpError> {
  runApi(await fetchApi("/admin/user", token: token), decodeSuccess(UserResponse.self))
}

func getAdminUsers(
  _ token: String,
  limit: Int? = nil,
  offset: Int? = nil,
  username: String? = nil,
  email: String? = nil,
  sort: String? = nil,
  direction: String? = nil
) async -> Result<AdminUserListResponse, HttpError> {
  runApi(
    await fetchApi(
      "/admin/users",
      token: token,
      query: [
        ("limit", limit.map(String.init)), ("offset", offset.map(String.init)),
        ("username", username), ("email", email), ("sort", sort), ("direction", direction),
      ]
    ),
    decodeSuccess(AdminUserListResponse.self)
  )
}

func deleteUser(_ token: String, id: Int) async -> Result<Bool, HttpError> {
  runApi(await fetchApi("/admin/users/\(id)", method: "DELETE", token: token), ensureIsOk(true))
}

func updateUserRole(_ token: String, id: Int, role: String) async -> Result<AdminUser, HttpError> {
  struct UpdateUserRoleRequest: Encodable { let role: String }
  return runApi(
    await fetchApi("/admin/users/\(id)/role", method: "PUT", token: token, body: UpdateUserRoleRequest(role: role)),
    decodeSuccess(AdminUser.self)
  )
}
