import Common_API_Type
import Component_SearchBar
import TeaCupPagination

let GET_USERS_LIMIT = 50

public struct UserScreenModel: Equatable {
  var pagination: Pagination.Model<AdminUser, HttpError>
  var selectedUser: AdminUser?
  var searchBar: SearchBarModel<UserSortAttr>
}

public enum UserScreenItemMsg {
  case selectUser(AdminUser?)
}

public enum UserScreenMsg {
  case noOp
  case clearSelected
  case searchBarMsg(SearchBarMsg<UserSortAttr>)
  case paginationMsg(Pagination.Msg<AdminUser, UserScreenItemMsg, HttpError>)
}
