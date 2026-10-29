package screen.userscreen

import common.api.handler.getAdminUsers
import common.api.type.AdminUser
import common.api.type.HttpError
import common.type.Shared
import teacup.Either
import teacup.map
import teacuppagination.Config
import teacuppagination.Page

internal data class SearchParams(val username: String? = null, val email: String? = null)

private fun parsePrefix(prefix: String, make: (String) -> SearchParams): (String) -> SearchParams? = { text ->
  if (text.startsWith(prefix)) make(text.removePrefix(prefix).trim()) else null
}

internal fun getSearchParams(searchText: String): SearchParams =
  if (searchText.isEmpty()) {
    SearchParams()
  } else {
    parsePrefix("username:") { SearchParams(username = it) }(searchText)
      ?: parsePrefix("@") { SearchParams(username = it) }(searchText)
      ?: parsePrefix("email:") { SearchParams(email = it) }(searchText)
      ?: SearchParams(username = searchText)
  }

fun mkPaginationConfig(shared: Shared, model: Model): Config<AdminUser, HttpError> =
  Config(
    handler = handler@{ offset, limit ->
      val token = shared.token ?: return@handler Either.Left(HttpError.notAuthenticated)
      val params = getSearchParams(model.searchBar.searchText.trim())
      getAdminUsers(
        token,
        limit = limit,
        offset = offset,
        username = params.username,
        email = params.email,
        sort = model.searchBar.sort.value,
        direction = model.searchBar.direction.value,
      ).map { Page(it.users, it.totalCount) }
    },
    limit = GET_USERS_LIMIT,
  )
