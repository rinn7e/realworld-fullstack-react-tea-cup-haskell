import SwiftUI

/// The items of a `Pagination.Model` as a list, with the list states and the
/// page controls under it: the `PaginationMemo` of the web app with the
/// `renderItems` and `renderPagination` every screen gives it. The list starts
/// at the top again on every page, like `scrollToTopCmd` of the package. The
/// header scrolls with the rows (above the rows it would fold the large title).
struct PagedListView<Item: Identifiable & Equatable, Row: View, Header: View>: View {
  let items: RemoteData<HttpError, [Item]>
  let page: Int
  let pageAmount: Int
  let entityLabel: String
  let onPageChange: Dispatcher<Int>
  @ViewBuilder let header: () -> Header
  @ViewBuilder let row: (Item) -> Row

  var body: some View {
    List {
      header()
      switch items {
      case .initial, .pending:
        ListLoadingView()
          .padding(.vertical, 40)
          .listRowSeparator(.hidden)
      case .failure(let error):
        ListErrorView(entityLabel: entityLabel, error: error)
          .listRowSeparator(.hidden)
      case .success(let list) where list.isEmpty:
        ListEmptyView(entityLabel: entityLabel)
          .listRowSeparator(.hidden)
      case .success(let list):
        ForEach(list) { item in row(item) }
      }
    }
    .listStyle(.plain)
    .id(page)
    .safeAreaInset(edge: .bottom, spacing: 0) {
      PaginationNavView(currentPage: page, pageAmount: pageAmount, onPageChange: onPageChange)
    }
  }
}

extension PagedListView where Header == EmptyView {
  init(
    items: RemoteData<HttpError, [Item]>,
    page: Int,
    pageAmount: Int,
    entityLabel: String,
    onPageChange: Dispatcher<Int>,
    @ViewBuilder row: @escaping (Item) -> Row
  ) {
    self.init(
      items: items,
      page: page,
      pageAmount: pageAmount,
      entityLabel: entityLabel,
      onPageChange: onPageChange,
      header: { EmptyView() },
      row: row
    )
  }
}
