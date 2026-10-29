package screen.articlescreen

import common.api.type.Article
import common.api.type.HttpError
import common.api.type.ArticleSortAttr

const val GET_ARTICLES_LIMIT = 50

// The package names of the search bar and the pagination are written out: a
// `Msg` imported from each would clash with the `Msg` of this screen
data class Model(
  val pagination: teacuppagination.Model<Article, HttpError>,
  val selectedArticle: Article?,
  val searchBar: component.searchbar.Model<ArticleSortAttr>,
)

sealed interface ItemMsg {
  data class SelectArticle(val article: Article?) : ItemMsg
}

sealed interface Msg {
  data object NoOp : Msg

  data object ClearSelected : Msg

  data class SearchBarMsg(val msg: component.searchbar.Msg<ArticleSortAttr>) : Msg

  data class PaginationMsg(val msg: teacuppagination.Msg<Article, ItemMsg, HttpError>) : Msg
}
