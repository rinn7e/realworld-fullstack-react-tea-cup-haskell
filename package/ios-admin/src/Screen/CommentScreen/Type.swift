// Module: Screen_CommentScreen_Type

import Common_API_Type_Comment
import Common_API_Type_Common
import Component_SearchBar_Type
import Package_TeaCupPagination_Pagination

@_spi(Screen_CommentScreen) public let GET_COMMENTS_LIMIT = 50

public struct CommentScreenModel: Equatable {
  @_spi(Screen_CommentScreen) public var pagination: Pagination.Model<Comment, HttpError>
  @_spi(Screen_CommentScreen) public var selectedComment: Comment?
  @_spi(Screen_CommentScreen) public var searchBar: SearchBarModel<CommentSortAttr>

  @_spi(Screen_CommentScreen) public init(pagination: Pagination.Model<Comment, HttpError>, selectedComment: Comment? = nil, searchBar: SearchBarModel<CommentSortAttr>) {
    self.pagination = pagination
    self.selectedComment = selectedComment
    self.searchBar = searchBar
  }
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
