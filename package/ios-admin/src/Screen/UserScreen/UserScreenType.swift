import CommonAPIType
import ComponentSearchBar
import TeaCupPagination

enum UserScreen {
  static let GET_USERS_LIMIT = 50

  struct Model: Equatable {
    var pagination: Pagination.Model<AdminUser, HttpError>
    var selectedUser: AdminUser?
    var searchBar: SearchBarModel<UserSortAttr>
  }

  enum UserItemMsg {
    case selectUser(AdminUser?)
  }

  enum Msg {
    case noOp
    case clearSelected
    case searchBarMsg(SearchBarMsg<UserSortAttr>)
    case paginationMsg(Pagination.Msg<AdminUser, UserItemMsg, HttpError>)
  }
}
