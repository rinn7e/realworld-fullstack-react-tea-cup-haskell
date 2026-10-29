import CommonAPIType
import CommonType
import TeaCup
import TeaCupPagination

extension UserScreen {
  static func initial(_ shared: Shared) -> (Model, Cmd<Msg>) {
    let (searchBar, searchBarCmd) = SearchBar.initial("", UserSortAttr.username, .asc)
    let initialModel = Model(
      pagination: Pagination.Model(items: .pending, page: 1, pageAmount: 0),
      selectedUser: nil,
      searchBar: searchBar
    )
    let (pagination, paginationCmd): (Pagination.Model<AdminUser, HttpError>, Cmd<Pagination.Msg<AdminUser, UserItemMsg, HttpError>>) =
      Pagination.initial(mkPaginationConfig(shared, initialModel), page: 1)

    var model = initialModel
    model.pagination = pagination
    return (
      model,
      .batch([paginationCmd.map(Msg.paginationMsg), searchBarCmd.map(Msg.searchBarMsg)])
    )
  }

  static func update(_ shared: Shared) -> (Msg, Model) -> (Model, Cmd<Msg>) {
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

  private static func searchBarMsgHandler(_ shared: Shared, _ subMsg: SearchBar.Msg<UserSortAttr>, _ model: Model) -> (Model, Cmd<Msg>) {
    let (searchBar, searchBarCmd) = SearchBar.update(subMsg, model.searchBar)
    var updatedModel = model
    updatedModel.searchBar = searchBar

    return updateAndCmd { (m: Model) -> (Model, Cmd<Msg>) in
      switch subMsg {
      case .submit, .changeSort, .changeDirection:
        let (pagination, paginationCmd): (Pagination.Model<AdminUser, HttpError>, Cmd<Pagination.Msg<AdminUser, UserItemMsg, HttpError>>) =
          Pagination.initial(mkPaginationConfig(shared, m), page: 1)
        var next = m
        next.pagination = pagination
        return (next, paginationCmd.map(Msg.paginationMsg))
      case .changeSearchText:
        return (m, .none)
      }
    }((updatedModel, searchBarCmd.map(Msg.searchBarMsg)))
  }

  private static func paginationMsgHandler(
    _ shared: Shared,
    _ subMsg: Pagination.Msg<AdminUser, UserItemMsg, HttpError>,
    _ model: Model
  ) -> (Model, Cmd<Msg>) {
    let (pagination, paginationCmd) = Pagination.update(mkPaginationConfig(shared, model))(subMsg, model.pagination)
    var updatedModel = model
    updatedModel.pagination = pagination

    return updateAndCmd { (m: Model) -> (Model, Cmd<Msg>) in
      if case .itemMsg(let itemMsg, _) = subMsg {
        return paginationItemMsgHandler(itemMsg)(m)
      } else {
        return (m, .none)
      }
    }((updatedModel, paginationCmd.map(Msg.paginationMsg)))
  }

  private static func paginationItemMsgHandler(_ msg: UserItemMsg) -> (Model) -> (Model, Cmd<Msg>) {
    { m in
      switch msg {
      case .selectUser(let user):
        var updatedModel = m
        updatedModel.selectedUser = user
        return (updatedModel, .none)
      }
    }
  }
}
