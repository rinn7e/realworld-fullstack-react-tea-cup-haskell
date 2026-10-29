// Module: Screen_ArticleScreen

import Common_API_Type
import Common_Type
import Component_PagedList
import Component_SearchBar
import Package_TeaCup
import SwiftUI

public struct ArticleScreenComponent: View, Equatable {
  let model: ArticleScreenModel
  let shared: Shared
  let dispatch: Dispatcher<ArticleScreenMsg>

  public init(model: ArticleScreenModel, shared: Shared, dispatch: Dispatcher<ArticleScreenMsg>) {
    self.model = model
    self.shared = shared
    self.dispatch = dispatch
  }

  private static let sortOptions: [SearchBarOption<ArticleSortAttr>] = [
    .init(label: "Creation Date", value: .createdAt),
    .init(label: "Favorites", value: .favoritesCount),
    .init(label: "Title", value: .title),
    .init(label: "ID", value: .id),
  ]

  public var body: some View {
    PagedListComponent(
      items: model.pagination.items,
      page: model.pagination.page,
      pageAmount: model.pagination.pageAmount,
      entityLabel: "articles",
      onPageChange: dispatch.map { ArticleScreenMsg.paginationMsg(.changePage($0)) }
    ) { article in
      Button {
        dispatch(.paginationMsg(.itemMsg(.selectArticle(article), item: article)))
      } label: {
        ArticleRow(article: article)
      }
      .tint(.primary)
    }
    .navigationTitle("Articles")
    .searchBar(
      model: model.searchBar,
      sortOptions: Self.sortOptions,
      placeholder: "Title, slug or content",
      dispatch: dispatch.map(ArticleScreenMsg.searchBarMsg)
    )
    .sheet(item: Binding(get: { model.selectedArticle }, set: { if $0 == nil { dispatch(.clearSelected) } })) { article in
      ArticleDetailSheet(article: article, dispatch: dispatch)
    }
  }
}
