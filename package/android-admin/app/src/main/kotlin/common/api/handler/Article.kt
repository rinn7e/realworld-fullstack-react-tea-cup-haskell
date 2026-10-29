package common.api.handler

import common.api.type.ArticleListResponse
import common.api.type.HttpError
import io.ktor.http.HttpMethod
import io.ktor.http.encodeURLPathPart
import teacup.Either

suspend fun getAdminArticles(
  token: String,
  limit: Int? = null,
  offset: Int? = null,
  tag: String? = null,
  author: String? = null,
  search: String? = null,
  sort: String? = null,
  direction: String? = null,
): Either<HttpError, ArticleListResponse> =
  runApi(
    fetchApi(
      "/admin/articles",
      token = token,
      query =
        listOf(
          "limit" to limit?.toString(), "offset" to offset?.toString(), "tag" to tag,
          "author" to author, "search" to search, "sort" to sort, "direction" to direction,
        ),
    ),
    decodeSuccess(),
  )

suspend fun deleteArticle(token: String, slug: String): Either<HttpError, Boolean> =
  runApi(fetchApi("/admin/articles/${slug.encodeURLPathPart()}", method = HttpMethod.Delete, token = token), ensureIsOk(true))
