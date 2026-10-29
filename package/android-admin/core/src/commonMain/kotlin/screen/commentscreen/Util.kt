package screen.commentscreen

import common.api.handler.getAdminComments
import common.api.type.Comment
import common.api.type.HttpError
import common.type.Shared
import teacup.Either
import teacup.map
import teacuppagination.Config
import teacuppagination.Page

internal data class SearchParams(val author: String? = null, val articleSlug: String? = null)

private fun parsePrefix(prefix: String, make: (String) -> SearchParams): (String) -> SearchParams? = { text ->
  if (text.startsWith(prefix)) make(text.removePrefix(prefix).trim()) else null
}

internal fun getSearchParams(searchText: String): SearchParams =
  if (searchText.isEmpty()) {
    SearchParams()
  } else {
    parsePrefix("author:") { SearchParams(author = it) }(searchText)
      ?: parsePrefix("@") { SearchParams(author = it) }(searchText)
      ?: parsePrefix("article:") { SearchParams(articleSlug = it) }(searchText)
      ?: parsePrefix("slug:") { SearchParams(articleSlug = it) }(searchText)
      ?: SearchParams(author = searchText)
  }

fun mkPaginationConfig(shared: Shared, model: Model): Config<Comment, HttpError> =
  Config(
    handler = handler@{ offset, limit ->
      val token = shared.token ?: return@handler Either.Left(HttpError.notAuthenticated)
      val params = getSearchParams(model.searchBar.searchText.trim())
      getAdminComments(
        token,
        limit = limit,
        offset = offset,
        author = params.author,
        articleSlug = params.articleSlug,
        sort = model.searchBar.sort.value,
        direction = model.searchBar.direction.value,
      ).map { Page(it.comments, it.totalCount) }
    },
    limit = GET_COMMENTS_LIMIT,
  )
