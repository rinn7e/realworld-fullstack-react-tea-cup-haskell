// Module: Screen_UserScreen_Update

import Common_API_Type_Common
import Common_API_Type_User
import Common_Type_Shared
import Component_SearchBar_Type
import Component_SearchBar_Update
import Package_TeaCupPagination_Pagination
import Package_TeaCup_Cmd
@_spi(Screen_UserScreen) import Screen_UserScreen_Type
@_spi(Screen_UserScreen) import Screen_UserScreen_Util

public func userScreenInitial(_ shared: Shared) -> (UserScreenModel, Cmd<UserScreenMsg>) {
  let (searchBar, searchBarCmd) = searchBarInitial("", UserSortAttr.username, .asc)
  let initialModel = UserScreenModel(
    pagination: Pagination.Model(items: .pending, page: 1, pageAmount: 0),
    selectedUser: nil,
    searchBar: searchBar
  )
  let (pagination, paginationCmd): (Pagination.Model<AdminUser, HttpError>, Cmd<Pagination.Msg<AdminUser, UserScreenItemMsg, HttpError>>) =
    Pagination.initial(mkPaginationConfig(shared, initialModel), page: 1)

  var model = initialModel
  model.pagination = pagination
  return (
    model,
    .batch([paginationCmd.map(UserScreenMsg.paginationMsg), searchBarCmd.map(UserScreenMsg.searchBarMsg)])
  )
}

public func userScreenUpdate(_ shared: Shared) -> (UserScreenMsg, UserScreenModel) -> (UserScreenModel, Cmd<UserScreenMsg>) {
  { msg, model in
    switch msg {
    case .clearSelected:
      var updatedModel = model
      updatedModel.selectedUser = nil
      return (updatedModel, .none)
    case .searchBarMsg(let subMsg):
      return searchBarMsgHandler(shared, subMsg, model)
    case .paginationMsg(let subMsg):
      return paginationMsgHandler(shared, subMsg, model)
    case .noOp:
      return (model, .none)
    }
  }
}

private func searchBarMsgHandler(_ shared: Shared, _ subMsg: SearchBarMsg<UserSortAttr>, _ model: UserScreenModel) -> (UserScreenModel, Cmd<UserScreenMsg>) {
  let (searchBar, searchBarCmd) = searchBarUpdate(subMsg, model.searchBar)
  var updatedModel = model
  updatedModel.searchBar = searchBar

  return updateAndCmd { (m: UserScreenModel) -> (UserScreenModel, Cmd<UserScreenMsg>) in
    switch subMsg {
    case .submit, .changeSort, .changeDirection:
      let (pagination, paginationCmd): (Pagination.Model<AdminUser, HttpError>, Cmd<Pagination.Msg<AdminUser, UserScreenItemMsg, HttpError>>) =
        Pagination.initial(mkPaginationConfig(shared, m), page: 1)
      var next = m
      next.pagination = pagination
      return (next, paginationCmd.map(UserScreenMsg.paginationMsg))
    case .changeSearchText:
      return (m, .none)
    }
  }((updatedModel, searchBarCmd.map(UserScreenMsg.searchBarMsg)))
}

private func paginationMsgHandler(
  _ shared: Shared,
  _ subMsg: Pagination.Msg<AdminUser, UserScreenItemMsg, HttpError>,
  _ model: UserScreenModel
) -> (UserScreenModel, Cmd<UserScreenMsg>) {
  let (pagination, paginationCmd) = Pagination.update(mkPaginationConfig(shared, model))(subMsg, model.pagination)
  var updatedModel = model
  updatedModel.pagination = pagination

  return updateAndCmd { (m: UserScreenModel) -> (UserScreenModel, Cmd<UserScreenMsg>) in
    if case .itemMsg(let itemMsg, _) = subMsg {
      return paginationItemMsgHandler(itemMsg)(m)
    } else {
      return (m, .none)
    }
  }((updatedModel, paginationCmd.map(UserScreenMsg.paginationMsg)))
}

private func paginationItemMsgHandler(_ msg: UserScreenItemMsg) -> (UserScreenModel) -> (UserScreenModel, Cmd<UserScreenMsg>) {
  { m in
    switch msg {
    case .selectUser(let user):
      var updatedModel = m
      updatedModel.selectedUser = user
      return (updatedModel, .none)
    }
  }
}
