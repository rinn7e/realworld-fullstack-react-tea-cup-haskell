package common.api.handler

import common.api.type.CommentListResponse
import common.api.type.HttpError
import io.ktor.http.HttpMethod
import teacup.Either

suspend fun getAdminComments(
  token: String,
  limit: Int? = null,
  offset: Int? = null,
  author: String? = null,
  articleSlug: String? = null,
  sort: String? = null,
  direction: String? = null,
): Either<HttpError, CommentListResponse> =
  runApi(
    fetchApi(
      "/admin/comments",
      token = token,
      query =
        listOf(
          "limit" to limit?.toString(), "offset" to offset?.toString(), "author" to author,
          "articleSlug" to articleSlug, "sort" to sort, "direction" to direction,
        ),
    ),
    decodeSuccess(),
  )

suspend fun deleteComment(token: String, id: Int): Either<HttpError, Boolean> =
  runApi(fetchApi("/admin/comments/$id", method = HttpMethod.Delete, token = token), ensureIsOk(true))
