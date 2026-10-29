import Common_API_Type
import TeaCup

public enum HomeScreenTimeFilter: String, Equatable, CaseIterable {
  case day = "24h"
  case week
  case month
  case year
}

public struct HomeScreenModel: Equatable {
  var stats: RemoteData<HttpError, DashboardStats>
  var visitorStats: RemoteData<HttpError, [VisitorStat]>
  var currentFilter: HomeScreenTimeFilter
  var logs: RemoteData<HttpError, [Log]>
  var selectedLog: Log?
}

public enum HomeScreenMsg {
  case noOp
  case refresh
  case changeFilter(HomeScreenTimeFilter)
  case selectLog(Log?)
  case statsResult(Result<DashboardStats, HttpError>)
  case visitorStatsResult(Result<[VisitorStat], HttpError>)
  case logsResult(Result<[Log], HttpError>)
}
