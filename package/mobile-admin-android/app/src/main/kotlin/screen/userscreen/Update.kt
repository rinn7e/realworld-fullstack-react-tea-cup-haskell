package screen.userscreen

import common.api.type.UserSortAttr
import common.type.Direction
import common.type.Shared
import teacup.Cmd
import teacup.RemoteData
import teacup.updateAndCmd
import component.searchbar.Msg as SearchBarMsg
import component.searchbar.initial as searchBarInitial
import component.searchbar.update as searchBarUpdate
import teacuppagination.Model as PaginationModel
import teacuppagination.Msg as PaginationMsg
import teacuppagination.initial as paginationInitial
import teacuppagination.update as paginationUpdate

fun initial(shared: Shared): Pair<Model, Cmd<Msg>> {
  val (searchBar, searchBarCmd) = searchBarInitial("", UserSortAttr.Username, Direction.Asc)
  val initialModel =
    Model(
      pagination = PaginationModel(items = RemoteData.Pending, page = 1, pageAmount = 0),
      selectedUser = null,
      searchBar = searchBar,
    )
  val (pagination, paginationCmd) = paginationInitial(mkPaginationConfig(shared, initialModel), page = 1)
  return initialModel.copy(pagination = pagination) to
    Cmd.batch(paginationCmd.map(Msg::PaginationMsg), searchBarCmd.map(Msg::SearchBarMsg))
}

fun update(shared: Shared, msg: Msg, model: Model): Pair<Model, Cmd<Msg>> =
  when (msg) {
    Msg.ClearSelected -> model.copy(selectedUser = null) to Cmd.none
    is Msg.SearchBarMsg -> searchBarMsgHandler(shared, msg.msg, model)
    is Msg.PaginationMsg -> paginationMsgHandler(shared, msg.msg, model)
    Msg.NoOp -> model to Cmd.none
  }

private fun searchBarMsgHandler(shared: Shared, subMsg: SearchBarMsg<UserSortAttr>, model: Model): Pair<Model, Cmd<Msg>> {
  val (searchBar, searchBarCmd) = searchBarUpdate(subMsg, model.searchBar)
  return updateAndCmd<Model, Msg> { m ->
    when (subMsg) {
      SearchBarMsg.Submit, is SearchBarMsg.ChangeSort, is SearchBarMsg.ChangeDirection -> {
        val (pagination, paginationCmd) = paginationInitial(mkPaginationConfig(shared, m), page = 1)
        m.copy(pagination = pagination) to paginationCmd.map(Msg::PaginationMsg)
      }

      is SearchBarMsg.ChangeSearchText -> m to Cmd.none
    }
  }(model.copy(searchBar = searchBar) to searchBarCmd.map(Msg::SearchBarMsg))
}

private fun paginationMsgHandler(
  shared: Shared,
  subMsg: PaginationMsg<common.api.type.AdminUser, ItemMsg, common.api.type.HttpError>,
  model: Model,
): Pair<Model, Cmd<Msg>> {
  val (pagination, paginationCmd) = paginationUpdate(mkPaginationConfig(shared, model), subMsg, model.pagination)
  return updateAndCmd<Model, Msg> { m ->
    if (subMsg is PaginationMsg.ItemMsg) paginationItemMsgHandler(subMsg.msg, m) else m to Cmd.none
  }(model.copy(pagination = pagination) to paginationCmd.map(Msg::PaginationMsg))
}

private fun paginationItemMsgHandler(msg: ItemMsg, model: Model): Pair<Model, Cmd<Msg>> =
  when (msg) {
    is ItemMsg.SelectUser -> model.copy(selectedUser = msg.user) to Cmd.none
  }
