import Common_API_Type
import Common_Type
import Component_PagedList
import Component_SearchBar
import SwiftUI
import TeaCup

public struct CommentScreenComponent: View, Equatable {
  let model: CommentScreenModel
  let shared: Shared
  let dispatch: Dispatcher<CommentScreenMsg>

  public init(model: CommentScreenModel, shared: Shared, dispatch: Dispatcher<CommentScreenMsg>) {
    self.model = model
    self.shared = shared
    self.dispatch = dispatch
  }

  private static let sortOptions: [SearchBarOption<CommentSortAttr>] = [
    .init(label: "Creation Date", value: .createdAt),
    .init(label: "Author", value: .author),
    .init(label: "ID", value: .id),
  ]

  public var body: some View {
    PagedListComponent(
      items: model.pagination.items,
      page: model.pagination.page,
      pageAmount: model.pagination.pageAmount,
      entityLabel: "comments",
      onPageChange: dispatch.map { CommentScreenMsg.paginationMsg(.changePage($0)) }
    ) { comment in
      Button {
        dispatch(.paginationMsg(.itemMsg(.selectComment(comment), item: comment)))
      } label: {
        CommentRow(comment: comment)
      }
      .tint(.primary)
    }
    .navigationTitle("Comments")
    .searchBar(
      model: model.searchBar,
      sortOptions: Self.sortOptions,
      placeholder: "Author, @user, article:slug",
      dispatch: dispatch.map(CommentScreenMsg.searchBarMsg)
    )
    .sheet(item: Binding(get: { model.selectedComment }, set: { if $0 == nil { dispatch(.clearSelected) } })) { comment in
      CommentDetailSheet(comment: comment, dispatch: dispatch)
    }
  }
}
