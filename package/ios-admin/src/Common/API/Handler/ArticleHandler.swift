import Foundation

func getAdminArticles(
  _ token: String,
  limit: Int? = nil,
  offset: Int? = nil,
  tag: String? = nil,
  author: String? = nil,
  search: String? = nil,
  sort: String? = nil,
  direction: String? = nil
) async -> Result<ArticleListResponse, HttpError> {
  runApi(
    await fetchApi(
      "/admin/articles",
      token: token,
      query: [
        ("limit", limit.map(String.init)), ("offset", offset.map(String.init)), ("tag", tag),
        ("author", author), ("search", search), ("sort", sort), ("direction", direction),
      ]
    ),
    decodeSuccess(ArticleListResponse.self)
  )
}

func deleteArticle(_ token: String, slug: String) async -> Result<Bool, HttpError> {
  let encoded = slug.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? slug
  return runApi(await fetchApi("/admin/articles/\(encoded)", method: "DELETE", token: token), ensureIsOk(true))
}
