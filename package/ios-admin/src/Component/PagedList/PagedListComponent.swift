import CommonAPIType
import ComponentListState
import ComponentPaginationNav
import SwiftUI
import TeaCup

/// The items of a `Pagination.Model` as a list, with the list states and the
/// page controls under it: the `PaginationMemo` of the web app with the
/// `renderItems` and `renderPagination` every screen gives it. The list starts
/// at the top again on every page, like `scrollToTopCmd` of the package. The
/// header scrolls with the rows (above the rows it would fold the large title).
public struct PagedListComponent<Item: Identifiable & Equatable, Row: View, Header: View>: View {
  let items: RemoteData<HttpError, [Item]>
  let page: Int
  let pageAmount: Int
  let entityLabel: String
  let onPageChange: Dispatcher<Int>
  let header: () -> Header
  let row: (Item) -> Row

  public init(
    items: RemoteData<HttpError, [Item]>,
    page: Int,
    pageAmount: Int,
    entityLabel: String,
    onPageChange: Dispatcher<Int>,
    @ViewBuilder header: @escaping () -> Header,
    @ViewBuilder row: @escaping (Item) -> Row
  ) {
    self.items = items
    self.page = page
    self.pageAmount = pageAmount
    self.entityLabel = entityLabel
    self.onPageChange = onPageChange
    self.header = header
    self.row = row
  }

  public var body: some View {
    List {
      header()
      switch items {
      case .initial, .pending:
        ListStateLoading()
          .padding(.vertical, 40)
          .listRowSeparator(.hidden)
      case .failure(let error):
        ListStateFailure(entityLabel: entityLabel, error: error)
          .listRowSeparator(.hidden)
      case .success(let list) where list.isEmpty:
        ListStateEmpty(entityLabel: entityLabel)
          .listRowSeparator(.hidden)
      case .success(let list):
        ForEach(list) { item in row(item) }
      }
    }
    .listStyle(.plain)
    .id(page)
    .safeAreaInset(edge: .bottom, spacing: 0) {
      PaginationNavComponent(currentPage: page, pageAmount: pageAmount, onPageChange: onPageChange)
    }
  }
}

extension PagedListComponent where Header == EmptyView {
  public init(
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
