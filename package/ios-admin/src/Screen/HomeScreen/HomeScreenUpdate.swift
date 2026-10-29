import TeaCup

extension HomeScreen {
  static func initial(_ shared: Shared) -> (Model, Cmd<Msg>) {
    let currentFilter = TimeFilter.week
    let model = Model(
      stats: .pending,
      visitorStats: .pending,
      currentFilter: currentFilter,
      logs: .pending,
      selectedLog: nil
    )
    return (model, fetchAllCmd(shared, currentFilter))
  }

  private static func fetchAllCmd(_ shared: Shared, _ filter: TimeFilter) -> Cmd<Msg> {
    guard let token = shared.token else { return .none }
    return .batch([
      .attempt({ await getDashboardStats(token) }, Msg.statsResult),
      .attempt({ await getVisitorStats(token, filter: filter.rawValue) }, Msg.visitorStatsResult),
      .attempt({ await getLogs(token, limit: 10).map(\.logs) }, Msg.logsResult),
    ])
  }

  static func update(_ shared: Shared) -> (Msg, Model) -> (Model, Cmd<Msg>) {
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

  private static func changeFilterHandler(_ shared: Shared, _ filter: TimeFilter, _ model: Model) -> (Model, Cmd<Msg>) {
    var updatedModel = model
    updatedModel.currentFilter = filter
    updatedModel.visitorStats = .pending
    guard let token = shared.token else { return (updatedModel, .none) }
    return (
      updatedModel,
      .attempt({ await getVisitorStats(token, filter: filter.rawValue) }, Msg.visitorStatsResult)
    )
  }
}
