import CommonAPIType
import ComponentSearchBar
import TeaCupPagination

enum CommentScreen {
  static let GET_COMMENTS_LIMIT = 50

  struct Model: Equatable {
    var pagination: Pagination.Model<Comment, HttpError>
    var selectedComment: Comment?
    var searchBar: SearchBarModel<CommentSortAttr>
  }

  enum CommentItemMsg {
    case selectComment(Comment?)
  }

  enum Msg {
    case noOp
    case clearSelected
    case searchBarMsg(SearchBarMsg<CommentSortAttr>)
    case paginationMsg(Pagination.Msg<Comment, CommentItemMsg, HttpError>)
  }
}
