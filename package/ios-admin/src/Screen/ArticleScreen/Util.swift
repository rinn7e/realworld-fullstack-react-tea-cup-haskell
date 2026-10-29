// Module: Screen_ArticleScreen_Util

import Common_API_Handler_Article
import Common_API_Type_Article
import Common_API_Type_Common
import Common_Type_Shared
import Package_TeaCupPagination_Pagination
@_spi(Screen_ArticleScreen) import Screen_ArticleScreen_Type

@_spi(Screen_ArticleScreen) public func mkPaginationConfig(_ shared: Shared, _ model: ArticleScreenModel) -> Pagination.Config<Article, HttpError> {
  Pagination.Config(
    handler: { offset, limit in
      guard let token = shared.token else { return .failure(.notAuthenticated) }
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
