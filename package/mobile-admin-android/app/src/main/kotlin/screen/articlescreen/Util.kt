package screen.articlescreen

import common.api.handler.getAdminArticles
import common.api.type.Article
import common.api.type.HttpError
import common.type.Shared
import teacup.Either
import teacup.map
import teacuppagination.Config
import teacuppagination.Page

fun mkPaginationConfig(shared: Shared, model: Model): Config<Article, HttpError> =
  Config(
    handler = handler@{ offset, limit ->
      val token = shared.token ?: return@handler Either.Left(HttpError.notAuthenticated)
      val search = model.searchBar.searchText.trim()
      getAdminArticles(
        token,
        limit = limit,
        offset = offset,
        search = search.ifEmpty { null },
        sort = model.searchBar.sort.value,
        direction = model.searchBar.direction.value,
      ).map { Page(it.articles, it.articlesCount) }
    },
    limit = GET_ARTICLES_LIMIT,
  )
