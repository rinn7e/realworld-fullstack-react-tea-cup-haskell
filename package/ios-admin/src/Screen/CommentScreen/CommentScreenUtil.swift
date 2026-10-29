import TeaCupPagination

extension CommentScreen {
  struct SearchParams {
    var author: String?
    var articleSlug: String?
  }

  private static func parsePrefix(_ prefix: String, _ key: KeyPath<SearchParams, String?>) -> (String) -> SearchParams? {
    { text in
      guard text.hasPrefix(prefix) else { return nil }
      let value = String(text.dropFirst(prefix.count)).trimmingCharacters(in: .whitespaces)
      return key == \SearchParams.author ? SearchParams(author: value) : SearchParams(articleSlug: value)
    }
  }

  static func getSearchParams(_ searchText: String) -> SearchParams {
    guard !searchText.isEmpty else { return SearchParams() }
    return parsePrefix("author:", \.author)(searchText)
      ?? parsePrefix("@", \.author)(searchText)
      ?? parsePrefix("article:", \.articleSlug)(searchText)
      ?? parsePrefix("slug:", \.articleSlug)(searchText)
      ?? SearchParams(author: searchText)
  }

  static func mkPaginationConfig(_ shared: Shared, _ model: Model) -> Pagination.Config<Comment, HttpError> {
    Pagination.Config(
      handler: { offset, limit in
        guard let token = shared.token else { return .failure(.notAuthenticated) }
        let params = getSearchParams(model.searchBar.searchText.trimmingCharacters(in: .whitespaces))
        return await getAdminComments(
          token,
          limit: limit,
          offset: offset,
          author: params.author,
          articleSlug: params.articleSlug,
          sort: model.searchBar.sort.rawValue,
          direction: model.searchBar.direction.rawValue
        ).map { Pagination.Page(items: $0.comments, totalCount: $0.totalCount) }
      },
      limit: GET_COMMENTS_LIMIT
    )
  }
}
