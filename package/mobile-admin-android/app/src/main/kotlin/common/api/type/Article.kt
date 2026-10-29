package common.api.type

import common.type.DateSerializer
import kotlinx.serialization.Serializable
import kotlin.time.Instant

enum class ArticleSortAttr(val value: String) {
  Id("id"),
  Title("title"),
  FavoritesCount("favoritesCount"),
  CreatedAt("createdAt"),
}

@Serializable
data class Article(
  val id: Int,
  val slug: String,
  val title: String,
  val description: String,
  val body: String,
  val tagList: List<String>,
  @Serializable(DateSerializer::class) val createdAt: Instant,
  @Serializable(DateSerializer::class) val updatedAt: Instant,
  val favorited: Boolean,
  val favoritesCount: Int,
  val author: AdminUser,
)

@Serializable
data class ArticleListResponse(
  val articles: List<Article>,
  val articlesCount: Int,
)
