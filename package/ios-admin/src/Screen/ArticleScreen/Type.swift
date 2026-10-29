// Module: Screen_ArticleScreen_Type

import Common_API_Type_Article
import Common_API_Type_Common
import Component_SearchBar_Type
import Package_TeaCupPagination_Pagination

@_spi(Screen_ArticleScreen) public let GET_ARTICLES_LIMIT = 50

public struct ArticleScreenModel: Equatable {
  @_spi(Screen_ArticleScreen) public var pagination: Pagination.Model<Article, HttpError>
  @_spi(Screen_ArticleScreen) public var selectedArticle: Article?
  @_spi(Screen_ArticleScreen) public var searchBar: SearchBarModel<ArticleSortAttr>

  @_spi(Screen_ArticleScreen) public init(pagination: Pagination.Model<Article, HttpError>, selectedArticle: Article? = nil, searchBar: SearchBarModel<ArticleSortAttr>) {
    self.pagination = pagination
    self.selectedArticle = selectedArticle
    self.searchBar = searchBar
  }
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
