import CommonAPIType
import ComponentSearchBar
import TeaCupPagination

let GET_COMMENTS_LIMIT = 50

public struct CommentScreenModel: Equatable {
  var pagination: Pagination.Model<Comment, HttpError>
  var selectedComment: Comment?
  var searchBar: SearchBarModel<CommentSortAttr>
}

public enum CommentScreenItemMsg {
  case selectComment(Comment?)
}

public enum CommentScreenMsg {
  case noOp
  case clearSelected
  case searchBarMsg(SearchBarMsg<CommentSortAttr>)
  case paginationMsg(Pagination.Msg<Comment, CommentScreenItemMsg, HttpError>)
}
