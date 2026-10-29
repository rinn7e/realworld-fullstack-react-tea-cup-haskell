package screen.commentscreen

import common.api.type.Comment
import common.api.type.HttpError
import common.api.type.CommentSortAttr

const val GET_COMMENTS_LIMIT = 50

// The package names of the search bar and the pagination are written out: a
// `Msg` imported from each would clash with the `Msg` of this screen
data class Model(
  val pagination: teacuppagination.Model<Comment, HttpError>,
  val selectedComment: Comment?,
  val searchBar: component.searchbar.Model<CommentSortAttr>,
)

sealed interface ItemMsg {
  data class SelectComment(val comment: Comment?) : ItemMsg
}

sealed interface Msg {
  data object NoOp : Msg

  data object ClearSelected : Msg

  data class SearchBarMsg(val msg: component.searchbar.Msg<CommentSortAttr>) : Msg

  data class PaginationMsg(val msg: teacuppagination.Msg<Comment, ItemMsg, HttpError>) : Msg
}
