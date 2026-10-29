import CommonAPIHandler
import CommonAPIType
import CommonType
import TeaCupPagination

struct SearchParams {
  var username: String?
  var email: String?
}

private func parsePrefix(_ prefix: String, _ key: KeyPath<SearchParams, String?>) -> (String) -> SearchParams? {
  { text in
    guard text.hasPrefix(prefix) else { return nil }
    let value = String(text.dropFirst(prefix.count)).trimmingCharacters(in: .whitespaces)
    return key == \SearchParams.username ? SearchParams(username: value) : SearchParams(email: value)
  }
}

func getSearchParams(_ searchText: String) -> SearchParams {
  guard !searchText.isEmpty else { return SearchParams() }
  return parsePrefix("username:", \.username)(searchText)
    ?? parsePrefix("@", \.username)(searchText)
    ?? parsePrefix("email:", \.email)(searchText)
    ?? SearchParams(username: searchText)
}

func mkPaginationConfig(_ shared: Shared, _ model: UserScreenModel) -> Pagination.Config<AdminUser, HttpError> {
  Pagination.Config(
    handler: { offset, limit in
      guard let token = shared.token else { return .failure(.notAuthenticated) }
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
