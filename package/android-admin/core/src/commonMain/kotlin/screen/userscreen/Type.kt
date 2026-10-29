package screen.userscreen

import common.api.type.AdminUser
import common.api.type.HttpError
import common.api.type.UserSortAttr

const val GET_USERS_LIMIT = 50

// The package names of the search bar and the pagination are written out: a
// `Msg` imported from each would clash with the `Msg` of this screen
data class Model(
  val pagination: teacuppagination.Model<AdminUser, HttpError>,
  val selectedUser: AdminUser?,
  val searchBar: component.searchbar.Model<UserSortAttr>,
)

sealed interface ItemMsg {
  data class SelectUser(val user: AdminUser?) : ItemMsg
}

sealed interface Msg {
  data object NoOp : Msg

  data object ClearSelected : Msg

  data class SearchBarMsg(val msg: component.searchbar.Msg<UserSortAttr>) : Msg

  data class PaginationMsg(val msg: teacuppagination.Msg<AdminUser, ItemMsg, HttpError>) : Msg
}
