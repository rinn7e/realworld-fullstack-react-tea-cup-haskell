import TeaCup

enum HomeScreen {
  enum TimeFilter: String, Equatable, CaseIterable {
    case day = "24h"
    case week
    case month
    case year
  }

  struct Model: Equatable {
    var stats: RemoteData<HttpError, DashboardStats>
    var visitorStats: RemoteData<HttpError, [VisitorStat]>
    var currentFilter: TimeFilter
    var logs: RemoteData<HttpError, [Log]>
    var selectedLog: Log?
  }

  enum Msg {
    case noOp
    case refresh
    case changeFilter(TimeFilter)
    case selectLog(Log?)
    case statsResult(Result<DashboardStats, HttpError>)
    case visitorStatsResult(Result<[VisitorStat], HttpError>)
    case logsResult(Result<[Log], HttpError>)
  }
}
