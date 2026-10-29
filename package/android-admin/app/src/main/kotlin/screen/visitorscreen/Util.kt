package screen.visitorscreen

import common.api.handler.getVisitors
import common.api.type.HttpError
import common.api.type.Visitor
import common.type.Shared
import teacup.Either
import teacup.map
import teacuppagination.Config
import teacuppagination.Page

internal data class SearchParams(val ip: String? = null, val path: String? = null)

internal fun getSearchParams(searchText: String): SearchParams {
  val trimmed = searchText.trim()
  return when {
    trimmed.isEmpty() -> SearchParams()
    trimmed.startsWith("/") -> SearchParams(path = trimmed)
    else -> SearchParams(ip = trimmed)
  }
}

fun mkPaginationConfig(shared: Shared, model: Model): Config<Visitor, HttpError> =
  Config(
    handler = handler@{ offset, limit ->
      val token = shared.token ?: return@handler Either.Left(HttpError.notAuthenticated)
      val params = getSearchParams(model.searchBar.searchText)
      getVisitors(token, limit = limit, offset = offset, ip = params.ip, path = params.path)
        .map { Page(it.visitors, it.totalCount) }
    },
    limit = GET_VISITORS_LIMIT,
  )
