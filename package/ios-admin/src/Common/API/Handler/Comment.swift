// Module: Common_API_Handler

import Common_API_Type

public func getAdminComments(
  _ token: String,
  limit: Int? = nil,
  offset: Int? = nil,
  author: String? = nil,
  articleSlug: String? = nil,
  sort: String? = nil,
  direction: String? = nil
) async -> Result<CommentListResponse, HttpError> {
  runApi(
    await fetchApi(
      "/admin/comments",
      token: token,
      query: [
        ("limit", limit.map(String.init)), ("offset", offset.map(String.init)), ("author", author),
        ("articleSlug", articleSlug), ("sort", sort), ("direction", direction),
      ]
    ),
    decodeSuccess(CommentListResponse.self)
  )
}

public func deleteComment(_ token: String, id: Int) async -> Result<Bool, HttpError> {
  runApi(await fetchApi("/admin/comments/\(id)", method: "DELETE", token: token), ensureIsOk(true))
}
