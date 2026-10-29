package common.api.handler

import common.api.type.DashboardStats
import common.api.type.HttpError
import common.api.type.LogListResponse
import common.api.type.VisitorListResponse
import common.api.type.VisitorStat
import teacup.Either

suspend fun getDashboardStats(token: String): Either<HttpError, DashboardStats> =
  runApi(fetchApi("/admin/dashboard/stats", token = token), decodeSuccess())

suspend fun getVisitorStats(token: String, filter: String? = null): Either<HttpError, List<VisitorStat>> =
  runApi(fetchApi("/admin/dashboard/visitor-stats", token = token, query = listOf("filter" to filter)), decodeSuccess())

suspend fun getLogs(
  token: String,
  limit: Int? = null,
  offset: Int? = null,
  level: String? = null,
  source: String? = null,
): Either<HttpError, LogListResponse> =
  runApi(
    fetchApi(
      "/admin/logs",
      token = token,
      query = listOf("limit" to limit?.toString(), "offset" to offset?.toString(), "level" to level, "source" to source),
    ),
    decodeSuccess(),
  )

suspend fun getVisitors(
  token: String,
  limit: Int? = null,
  offset: Int? = null,
  ip: String? = null,
  path: String? = null,
): Either<HttpError, VisitorListResponse> =
  runApi(
    fetchApi(
      "/admin/visitors",
      token = token,
      query = listOf("limit" to limit?.toString(), "offset" to offset?.toString(), "ip" to ip, "path" to path),
    ),
    decodeSuccess(),
  )
