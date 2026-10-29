import CommonAPIType
import CommonType
import ComponentPagedList
import ComponentSearchBar
import SwiftUI
import TeaCup

public struct VisitorScreenComponent: View, Equatable {
  let model: VisitorScreenModel
  let shared: Shared
  let dispatch: Dispatcher<VisitorScreenMsg>

  public init(model: VisitorScreenModel, shared: Shared, dispatch: Dispatcher<VisitorScreenMsg>) {
    self.model = model
    self.shared = shared
    self.dispatch = dispatch
  }

  private static let sortOptions: [SearchBarOption<VisitorSortAttr>] = [
    .init(label: "Timestamp", value: .timestamp),
    .init(label: "Path", value: .path),
    .init(label: "IP", value: .ip),
    .init(label: "ID", value: .id),
  ]

  public var body: some View {
    PagedListComponent(
      items: model.pagination.items,
      page: model.pagination.page,
      pageAmount: model.pagination.pageAmount,
      entityLabel: "visitors",
      onPageChange: dispatch.map { VisitorScreenMsg.paginationMsg(.changePage($0)) }
    ) {
      if model.isDescriptionOpen {
        Text(
          "Each entry here represents a **unique device** that has visited the website, not an individual page hit. Uniqueness is determined by a SHA-256 fingerprint derived from the visitor's IP address, browser User-Agent, and Accept-Language header. Revisiting the site updates the existing record's last-seen path and timestamp rather than creating a new one."
        )
        .font(.footnote)
        .foregroundStyle(.secondary)
        .listRowBackground(Color(.secondarySystemBackground))
      }
    } row: { visitor in
      Button {
        dispatch(.paginationMsg(.itemMsg(.selectVisitor(visitor), item: visitor)))
      } label: {
        VisitorRow(visitor: visitor)
      }
      .tint(.primary)
    }
    .animation(.default, value: model.isDescriptionOpen)
    .navigationTitle("Visitors")
    .toolbar {
      ToolbarItem(placement: .topBarLeading) {
        Button {
          dispatch(.toggleDescription)
        } label: {
          Label(
            model.isDescriptionOpen ? "Hide description" : "Show description",
            systemImage: model.isDescriptionOpen ? "info.circle.fill" : "info.circle"
          )
        }
      }
    }
    .searchBar(
      model: model.searchBar,
      sortOptions: Self.sortOptions,
      placeholder: "IP, or a path starting with /",
      dispatch: dispatch.map(VisitorScreenMsg.searchBarMsg)
    )
    .sheet(item: Binding(get: { model.selectedVisitor }, set: { if $0 == nil { dispatch(.clearSelected) } })) { visitor in
      VisitorDetailSheet(visitor: visitor, dispatch: dispatch)
    }
  }
}
