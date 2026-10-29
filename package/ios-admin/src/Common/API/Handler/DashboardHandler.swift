func getDashboardStats(_ token: String) async -> Result<DashboardStats, HttpError> {
  runApi(await fetchApi("/admin/dashboard/stats", token: token), decodeSuccess(DashboardStats.self))
}

func getVisitorStats(_ token: String, filter: String? = nil) async -> Result<[VisitorStat], HttpError> {
  runApi(
    await fetchApi("/admin/dashboard/visitor-stats", token: token, query: [("filter", filter)]),
    decodeSuccess([VisitorStat].self)
  )
}

func getLogs(
  _ token: String,
  limit: Int? = nil,
  offset: Int? = nil,
  level: String? = nil,
  source: String? = nil
) async -> Result<LogListResponse, HttpError> {
  runApi(
    await fetchApi(
      "/admin/logs",
      token: token,
      query: [("limit", limit.map(String.init)), ("offset", offset.map(String.init)), ("level", level), ("source", source)]
    ),
    decodeSuccess(LogListResponse.self)
  )
}

func getVisitors(
  _ token: String,
  limit: Int? = nil,
  offset: Int? = nil,
  ip: String? = nil,
  path: String? = nil
) async -> Result<VisitorListResponse, HttpError> {
  runApi(
    await fetchApi(
      "/admin/visitors",
      token: token,
      query: [("limit", limit.map(String.init)), ("offset", offset.map(String.init)), ("ip", ip), ("path", path)]
    ),
    decodeSuccess(VisitorListResponse.self)
  )
}
