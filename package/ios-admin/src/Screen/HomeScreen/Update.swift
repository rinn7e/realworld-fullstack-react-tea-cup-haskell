import Common_API_Handler
import Common_Type
import Package_TeaCup

public func homeScreenInitial(_ shared: Shared) -> (HomeScreenModel, Cmd<HomeScreenMsg>) {
  let currentFilter = HomeScreenTimeFilter.week
  let model = HomeScreenModel(
    stats: .pending,
    visitorStats: .pending,
    currentFilter: currentFilter,
    logs: .pending,
    selectedLog: nil
  )
  return (model, fetchAllCmd(shared, currentFilter))
}

private func fetchAllCmd(_ shared: Shared, _ filter: HomeScreenTimeFilter) -> Cmd<HomeScreenMsg> {
  guard let token = shared.token else { return .none }
  return .batch([
    .attempt({ await getDashboardStats(token) }, HomeScreenMsg.statsResult),
    .attempt({ await getVisitorStats(token, filter: filter.rawValue) }, HomeScreenMsg.visitorStatsResult),
    .attempt({ await getLogs(token, limit: 10).map(\.logs) }, HomeScreenMsg.logsResult),
  ])
}

public func homeScreenUpdate(_ shared: Shared) -> (HomeScreenMsg, HomeScreenModel) -> (HomeScreenModel, Cmd<HomeScreenMsg>) {
  { msg, model in
    var model = model
    switch msg {
    case .refresh:
      model.stats = .pending
      model.visitorStats = .pending
      model.logs = .pending
      return (model, fetchAllCmd(shared, model.currentFilter))
    case .changeFilter(let filter):
      return changeFilterHandler(shared, filter, model)
    case .selectLog(let log):
      model.selectedLog = log
      return (model, .none)
    case .statsResult(let result):
      model.stats = RemoteData(result)
      return (model, .none)
    case .visitorStatsResult(let result):
      model.visitorStats = RemoteData(result)
      return (model, .none)
    case .logsResult(let result):
      model.logs = RemoteData(result)
      return (model, .none)
    case .noOp:
      return (model, .none)
    }
  }
}

private func changeFilterHandler(_ shared: Shared, _ filter: HomeScreenTimeFilter, _ model: HomeScreenModel) -> (HomeScreenModel, Cmd<HomeScreenMsg>) {
  var updatedModel = model
  updatedModel.currentFilter = filter
  updatedModel.visitorStats = .pending
  guard let token = shared.token else { return (updatedModel, .none) }
  return (
    updatedModel,
    .attempt({ await getVisitorStats(token, filter: filter.rawValue) }, HomeScreenMsg.visitorStatsResult)
  )
}
