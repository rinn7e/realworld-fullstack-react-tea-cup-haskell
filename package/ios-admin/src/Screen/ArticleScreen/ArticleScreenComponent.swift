import SwiftUI
import TeaCup

extension ArticleScreen {
  /// The views used only by this screen (`SubComponent/`)
  enum SubComponent {}

  struct Component: View, Equatable {
    let model: ArticleScreen.Model
    let shared: Shared
    let dispatch: Dispatcher<ArticleScreen.Msg>

    private static let sortOptions: [SearchBar.SearchOption<ArticleSortAttr>] = [
      .init(label: "Creation Date", value: .createdAt),
      .init(label: "Favorites", value: .favoritesCount),
      .init(label: "Title", value: .title),
      .init(label: "ID", value: .id),
    ]

    var body: some View {
      PagedList(
        items: model.pagination.items,
        page: model.pagination.page,
        pageAmount: model.pagination.pageAmount,
        entityLabel: "articles",
        onPageChange: dispatch.map { ArticleScreen.Msg.paginationMsg(.changePage($0)) }
      ) { article in
        Button {
          dispatch(.paginationMsg(.itemMsg(.selectArticle(article), item: article)))
        } label: {
          ArticleScreen.SubComponent.ArticleRow(article: article)
        }
        .tint(.primary)
      }
      .navigationTitle("Articles")
      .searchBar(
        model: model.searchBar,
        sortOptions: Self.sortOptions,
        placeholder: "Title, slug or content",
        dispatch: dispatch.map(ArticleScreen.Msg.searchBarMsg)
      )
      .sheet(item: Binding(get: { model.selectedArticle }, set: { if $0 == nil { dispatch(.clearSelected) } })) { article in
        ArticleScreen.SubComponent.ArticleDetailSheet(article: article, dispatch: dispatch)
      }
    }
  }
}
