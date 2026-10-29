package screen.homescreen

import common.api.type.DashboardStats
import common.api.type.HttpError
import common.api.type.Log
import common.api.type.VisitorStat
import teacup.Either
import teacup.RemoteData

enum class TimeFilter(val value: String) {
  Day("24h"),
  Week("week"),
  Month("month"),
  Year("year"),
}

data class Model(
  val stats: RemoteData<HttpError, DashboardStats>,
  val visitorStats: RemoteData<HttpError, List<VisitorStat>>,
  val currentFilter: TimeFilter,
  val logs: RemoteData<HttpError, List<Log>>,
  val selectedLog: Log?,
)

sealed interface Msg {
  data object NoOp : Msg

  data object Refresh : Msg

  data class ChangeFilter(val filter: TimeFilter) : Msg

  data class SelectLog(val log: Log?) : Msg

  data class StatsResult(val result: Either<HttpError, DashboardStats>) : Msg

  data class VisitorStatsResult(val result: Either<HttpError, List<VisitorStat>>) : Msg

  data class LogsResult(val result: Either<HttpError, List<Log>>) : Msg
}
