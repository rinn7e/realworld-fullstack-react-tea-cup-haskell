import TeaCupPagination

enum UserScreen {
  static let GET_USERS_LIMIT = 50

  struct Model: Equatable {
    var pagination: Pagination.Model<AdminUser, HttpError>
    var selectedUser: AdminUser?
    var searchBar: SearchBar.Model<UserSortAttr>
  }

  enum UserItemMsg {
    case selectUser(AdminUser?)
  }

  enum Msg {
    case noOp
    case clearSelected
    case searchBarMsg(SearchBar.Msg<UserSortAttr>)
    case paginationMsg(Pagination.Msg<AdminUser, UserItemMsg, HttpError>)
  }
}
