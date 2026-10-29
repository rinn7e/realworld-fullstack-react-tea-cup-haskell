package screen.homescreen

import common.api.handler.getDashboardStats
import common.api.handler.getLogs
import common.api.handler.getVisitorStats
import common.type.Shared
import teacup.Cmd
import teacup.RemoteData
import teacup.map

fun initial(shared: Shared): Pair<Model, Cmd<Msg>> {
  val currentFilter = TimeFilter.Week
  val model =
    Model(
      stats = RemoteData.Pending,
      visitorStats = RemoteData.Pending,
      currentFilter = currentFilter,
      logs = RemoteData.Pending,
      selectedLog = null,
    )
  return model to fetchAllCmd(shared, currentFilter)
}

private fun fetchAllCmd(shared: Shared, filter: TimeFilter): Cmd<Msg> {
  val token = shared.token ?: return Cmd.none
  return Cmd.batch(
    Cmd.attempt({ getDashboardStats(token) }, Msg::StatsResult),
    Cmd.attempt({ getVisitorStats(token, filter = filter.value) }, Msg::VisitorStatsResult),
    Cmd.attempt({ getLogs(token, limit = 10).map { it.logs } }, Msg::LogsResult),
  )
}

fun update(shared: Shared, msg: Msg, model: Model): Pair<Model, Cmd<Msg>> =
  when (msg) {
    Msg.Refresh ->
      model.copy(stats = RemoteData.Pending, visitorStats = RemoteData.Pending, logs = RemoteData.Pending) to
        fetchAllCmd(shared, model.currentFilter)

    is Msg.ChangeFilter -> changeFilterHandler(shared, msg.filter, model)
    is Msg.SelectLog -> model.copy(selectedLog = msg.log) to Cmd.none
    is Msg.StatsResult -> model.copy(stats = RemoteData.of(msg.result)) to Cmd.none
    is Msg.VisitorStatsResult -> model.copy(visitorStats = RemoteData.of(msg.result)) to Cmd.none
    is Msg.LogsResult -> model.copy(logs = RemoteData.of(msg.result)) to Cmd.none
    Msg.NoOp -> model to Cmd.none
  }

private fun changeFilterHandler(shared: Shared, filter: TimeFilter, model: Model): Pair<Model, Cmd<Msg>> {
  val updatedModel = model.copy(currentFilter = filter, visitorStats = RemoteData.Pending)
  val token = shared.token ?: return updatedModel to Cmd.none
  return updatedModel to Cmd.attempt({ getVisitorStats(token, filter = filter.value) }, Msg::VisitorStatsResult)
}
