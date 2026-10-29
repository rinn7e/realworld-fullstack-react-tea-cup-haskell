package screen.visitorscreen

import common.api.type.Visitor
import common.api.type.HttpError
import common.api.type.VisitorSortAttr

const val GET_VISITORS_LIMIT = 50

// The package names of the search bar and the pagination are written out: a
// `Msg` imported from each would clash with the `Msg` of this screen
data class Model(
  val pagination: teacuppagination.Model<Visitor, HttpError>,
  val selectedVisitor: Visitor?,
  val searchBar: component.searchbar.Model<VisitorSortAttr>,
  val isDescriptionOpen: Boolean,
)

sealed interface ItemMsg {
  data class SelectVisitor(val visitor: Visitor?) : ItemMsg
}

sealed interface Msg {
  data object NoOp : Msg

  data object ClearSelected : Msg

  data object ToggleDescription : Msg

  data class SearchBarMsg(val msg: component.searchbar.Msg<VisitorSortAttr>) : Msg

  data class PaginationMsg(val msg: teacuppagination.Msg<Visitor, ItemMsg, HttpError>) : Msg
}
