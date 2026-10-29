import Common_API_Type
import Common_Type
import Component_PagedList
import Component_SearchBar
import Package_TeaCup
import SwiftUI

public struct UserScreenComponent: View, Equatable {
  let model: UserScreenModel
  let shared: Shared
  let dispatch: Dispatcher<UserScreenMsg>

  public init(model: UserScreenModel, shared: Shared, dispatch: Dispatcher<UserScreenMsg>) {
    self.model = model
    self.shared = shared
    self.dispatch = dispatch
  }

  private static let sortOptions: [SearchBarOption<UserSortAttr>] = [
    .init(label: "Username", value: .username),
    .init(label: "Email", value: .email),
    .init(label: "ID", value: .id),
  ]

  public var body: some View {
    PagedListComponent(
      items: model.pagination.items,
      page: model.pagination.page,
      pageAmount: model.pagination.pageAmount,
      entityLabel: "users",
      onPageChange: dispatch.map { UserScreenMsg.paginationMsg(.changePage($0)) }
    ) { user in
      Button {
        dispatch(.paginationMsg(.itemMsg(.selectUser(user), item: user)))
      } label: {
        UserRow(user: user)
      }
      .tint(.primary)
    }
    .navigationTitle("Users")
    .searchBar(
      model: model.searchBar,
      sortOptions: Self.sortOptions,
      placeholder: "Username, @user, email:…",
      dispatch: dispatch.map(UserScreenMsg.searchBarMsg)
    )
    .sheet(item: Binding(get: { model.selectedUser }, set: { if $0 == nil { dispatch(.clearSelected) } })) { user in
      UserDetailSheet(user: user, dispatch: dispatch)
    }
  }
}
