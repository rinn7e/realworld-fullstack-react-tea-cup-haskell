package common.api.type

import common.type.DateSerializer
import kotlinx.serialization.Serializable
import kotlin.time.Instant

enum class VisitorSortAttr(val value: String) {
  Id("id"),
  Ip("ip"),
  Path("path"),
  Timestamp("timestamp"),
}

@Serializable
data class Visitor(
  val id: Int,
  val ip: String,
  val userAgent: String,
  val path: String,
  val fingerprint: String,
  @Serializable(DateSerializer::class) val timestamp: Instant,
  val user: AdminUser? = null,
)

@Serializable
data class VisitorListResponse(
  val visitors: List<Visitor>,
  val totalCount: Int,
)
