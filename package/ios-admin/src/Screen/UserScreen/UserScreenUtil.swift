extension UserScreen {
  struct SearchParams {
    var username: String?
    var email: String?
  }

  private static func parsePrefix(_ prefix: String, _ key: KeyPath<SearchParams, String?>) -> (String) -> SearchParams? {
    { text in
      guard text.hasPrefix(prefix) else { return nil }
      let value = String(text.dropFirst(prefix.count)).trimmingCharacters(in: .whitespaces)
      return key == \SearchParams.username ? SearchParams(username: value) : SearchParams(email: value)
    }
  }

  static func getSearchParams(_ searchText: String) -> SearchParams {
    guard !searchText.isEmpty else { return SearchParams() }
    return parsePrefix("username:", \.username)(searchText)
      ?? parsePrefix("@", \.username)(searchText)
      ?? parsePrefix("email:", \.email)(searchText)
      ?? SearchParams(username: searchText)
  }

  static func mkPaginationConfig(_ shared: Shared, _ model: Model) -> Pagination.Config<AdminUser, HttpError> {
    Pagination.Config(
      handler: { offset, limit in
        guard let token = shared.token else { return .failure(notAuthenticatedError) }
        let params = getSearchParams(model.searchBar.searchText.trimmingCharacters(in: .whitespaces))
        return await getAdminUsers(
          token,
          limit: limit,
          offset: offset,
          username: params.username,
          email: params.email,
          sort: model.searchBar.sort.rawValue,
          direction: model.searchBar.direction.rawValue
        ).map { Pagination.Page(items: $0.users, totalCount: $0.totalCount) }
      },
      limit: GET_USERS_LIMIT
    )
  }
}

let notAuthenticatedError = HttpError(
  statusCode: 401,
  err: ApiError(errors: ["body": ["Not authenticated"]]),
  actualErr: "Not authenticated"
)
