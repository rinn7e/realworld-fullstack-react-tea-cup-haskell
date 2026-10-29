import SwiftUI

struct UserScreenView: View, Equatable {
  let model: UserScreen.Model
  let shared: Shared
  let dispatch: Dispatcher<UserScreen.Msg>

  private static let sortOptions: [SearchBar.SearchOption<UserSortAttr>] = [
    .init(label: "Username", value: .username),
    .init(label: "Email", value: .email),
    .init(label: "ID", value: .id),
  ]

  var body: some View {
    PagedListView(
      items: model.pagination.items,
      page: model.pagination.page,
      pageAmount: model.pagination.pageAmount,
      entityLabel: "users",
      onPageChange: dispatch.map { Msg.paginationMsg(.changePage($0)) }
    ) { user in
      Button {
        dispatch(.paginationMsg(.itemMsg(.selectUser(user), item: user)))
      } label: {
        UserRowView(user: user)
      }
      .tint(.primary)
    }
    .navigationTitle("Users")
    .searchBar(
      model: model.searchBar,
      sortOptions: Self.sortOptions,
      placeholder: "Username, @user, email:…",
      dispatch: dispatch.map(Msg.searchBarMsg)
    )
    .sheet(item: Binding(get: { model.selectedUser }, set: { if $0 == nil { dispatch(.clearSelected) } })) { user in
      UserDetailSheetView(user: user, dispatch: dispatch)
    }
  }

  private typealias Msg = UserScreen.Msg
}
