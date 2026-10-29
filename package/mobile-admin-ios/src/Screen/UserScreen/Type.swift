// Module: Screen_UserScreen_Type

import Common_API_Type_Common
import Common_API_Type_User
import Component_SearchBar_Type
import Package_TeaCupPagination_Pagination

@_spi(Screen_UserScreen) public let GET_USERS_LIMIT = 50

public struct UserScreenModel: Equatable {
  @_spi(Screen_UserScreen) public var pagination: Pagination.Model<AdminUser, HttpError>
  @_spi(Screen_UserScreen) public var selectedUser: AdminUser?
  @_spi(Screen_UserScreen) public var searchBar: SearchBarModel<UserSortAttr>

  @_spi(Screen_UserScreen) public init(pagination: Pagination.Model<AdminUser, HttpError>, selectedUser: AdminUser? = nil, searchBar: SearchBarModel<UserSortAttr>) {
    self.pagination = pagination
    self.selectedUser = selectedUser
    self.searchBar = searchBar
  }
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
