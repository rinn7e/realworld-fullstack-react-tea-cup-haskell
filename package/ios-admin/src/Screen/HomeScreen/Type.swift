// Module: Screen_HomeScreen_Type

import Common_API_Type_Common
import Common_API_Type_Dashboard
import Package_TeaCup_RemoteData

public enum HomeScreenTimeFilter: String, Equatable, CaseIterable {
  case day = "24h"
  case week
  case month
  case year
}

public struct HomeScreenModel: Equatable {
  @_spi(Screen_HomeScreen) public var stats: RemoteData<HttpError, DashboardStats>
  @_spi(Screen_HomeScreen) public var visitorStats: RemoteData<HttpError, [VisitorStat]>
  @_spi(Screen_HomeScreen) public var currentFilter: HomeScreenTimeFilter
  @_spi(Screen_HomeScreen) public var logs: RemoteData<HttpError, [Log]>
  @_spi(Screen_HomeScreen) public var selectedLog: Log?

  @_spi(Screen_HomeScreen) public init(stats: RemoteData<HttpError, DashboardStats>, visitorStats: RemoteData<HttpError, [VisitorStat]>, currentFilter: HomeScreenTimeFilter, logs: RemoteData<HttpError, [Log]>, selectedLog: Log? = nil) {
    self.stats = stats
    self.visitorStats = visitorStats
    self.currentFilter = currentFilter
    self.logs = logs
    self.selectedLog = selectedLog
  }
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
