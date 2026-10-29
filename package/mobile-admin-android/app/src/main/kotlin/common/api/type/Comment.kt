package common.api.type

import common.type.DateSerializer
import kotlinx.serialization.Serializable
import kotlin.time.Instant

enum class CommentSortAttr(val value: String) {
  Id("id"),
  CreatedAt("createdAt"),
  Author("author"),
}

@Serializable
data class Comment(
  val id: Int,
  val body: String,
  @Serializable(DateSerializer::class) val createdAt: Instant,
  @Serializable(DateSerializer::class) val updatedAt: Instant,
  val articleSlug: String,
  val author: Profile,
)

@Serializable
data class CommentListResponse(
  val comments: List<Comment>,
  val totalCount: Int,
)
