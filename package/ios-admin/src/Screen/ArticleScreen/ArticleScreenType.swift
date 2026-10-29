import CommonAPIType
import ComponentSearchBar
import TeaCupPagination

enum ArticleScreen {
  static let GET_ARTICLES_LIMIT = 50

  struct Model: Equatable {
    var pagination: Pagination.Model<Article, HttpError>
    var selectedArticle: Article?
    var searchBar: SearchBarModel<ArticleSortAttr>
  }

  enum ArticleItemMsg {
    case selectArticle(Article?)
  }

  enum Msg {
    case noOp
    case clearSelected
    case searchBarMsg(SearchBarMsg<ArticleSortAttr>)
    case paginationMsg(Pagination.Msg<Article, ArticleItemMsg, HttpError>)
  }
}
