import CommonAPIType
import ComponentSearchBar
import TeaCupPagination

let GET_ARTICLES_LIMIT = 50

public struct ArticleScreenModel: Equatable {
  var pagination: Pagination.Model<Article, HttpError>
  var selectedArticle: Article?
  var searchBar: SearchBarModel<ArticleSortAttr>
}

public enum ArticleScreenItemMsg {
  case selectArticle(Article?)
}

public enum ArticleScreenMsg {
  case noOp
  case clearSelected
  case searchBarMsg(SearchBarMsg<ArticleSortAttr>)
  case paginationMsg(Pagination.Msg<Article, ArticleScreenItemMsg, HttpError>)
}
