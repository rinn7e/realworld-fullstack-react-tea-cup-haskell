package common.api.type

import common.type.DateSerializer
import kotlinx.serialization.Serializable
import kotlin.time.Instant

@Serializable
data class DashboardStats(
  val totalUsers: Int,
  val totalArticles: Int,
  val totalComments: Int,
  val totalVisitors: Int,
  val activeUsers24h: Int,
)

@Serializable
data class VisitorStat(
  val name: String,
  val visitors: Int,
)

@Serializable
enum class LogLevel {
  INFO,
  WARNING,
  ERROR,
  DEBUG,
}

@Serializable
data class Log(
  val id: Int,
  val level: LogLevel,
  val message: String,
  val source: String,
  @Serializable(DateSerializer::class) val timestamp: Instant,
  val userId: Int? = null,
)

@Serializable
data class LogListResponse(
  val logs: List<Log>,
  val totalCount: Int,
)
