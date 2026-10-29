import CommonAPIType
import CommonType
import SwiftUI
import TeaCup

extension CommentScreen {
  /// The views used only by this screen (`SubComponent/`)
  enum SubComponent {}

  struct Component: View, Equatable {
    let model: CommentScreen.Model
    let shared: Shared
    let dispatch: Dispatcher<CommentScreen.Msg>

    private static let sortOptions: [SearchBar.SearchOption<CommentSortAttr>] = [
      .init(label: "Creation Date", value: .createdAt),
      .init(label: "Author", value: .author),
      .init(label: "ID", value: .id),
    ]

    var body: some View {
      PagedList(
        items: model.pagination.items,
        page: model.pagination.page,
        pageAmount: model.pagination.pageAmount,
        entityLabel: "comments",
        onPageChange: dispatch.map { CommentScreen.Msg.paginationMsg(.changePage($0)) }
      ) { comment in
        Button {
          dispatch(.paginationMsg(.itemMsg(.selectComment(comment), item: comment)))
        } label: {
          CommentScreen.SubComponent.CommentRow(comment: comment)
        }
        .tint(.primary)
      }
      .navigationTitle("Comments")
      .searchBar(
        model: model.searchBar,
        sortOptions: Self.sortOptions,
        placeholder: "Author, @user, article:slug",
        dispatch: dispatch.map(CommentScreen.Msg.searchBarMsg)
      )
      .sheet(item: Binding(get: { model.selectedComment }, set: { if $0 == nil { dispatch(.clearSelected) } })) { comment in
        CommentScreen.SubComponent.CommentDetailSheet(comment: comment, dispatch: dispatch)
      }
    }
  }
}
