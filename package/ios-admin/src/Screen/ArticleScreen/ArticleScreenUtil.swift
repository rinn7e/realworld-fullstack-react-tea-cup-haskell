extension ArticleScreen {
  static func mkPaginationConfig(_ shared: Shared, _ model: Model) -> Pagination.Config<Article, HttpError> {
    Pagination.Config(
      handler: { offset, limit in
        guard let token = shared.token else { return .failure(notAuthenticatedError) }
        let search = model.searchBar.searchText.trimmingCharacters(in: .whitespaces)
        return await getAdminArticles(
          token,
          limit: limit,
          offset: offset,
          search: search.isEmpty ? nil : search,
          sort: model.searchBar.sort.rawValue,
          direction: model.searchBar.direction.rawValue
        ).map { Pagination.Page(items: $0.articles, totalCount: $0.articlesCount) }
      },
      limit: GET_ARTICLES_LIMIT
    )
  }
}
