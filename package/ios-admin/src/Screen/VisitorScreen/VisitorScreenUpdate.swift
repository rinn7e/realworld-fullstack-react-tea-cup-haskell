import CommonAPIType
import CommonType
import ComponentSearchBar
import TeaCup
import TeaCupPagination

private typealias PaginationModel = Pagination.Model<Visitor, HttpError>
private typealias PaginationMsg = Pagination.Msg<Visitor, VisitorScreenItemMsg, HttpError>

public func visitorScreenInitial(_ shared: Shared) -> (VisitorScreenModel, Cmd<VisitorScreenMsg>) {
  let (searchBar, searchBarCmd) = searchBarInitial("", VisitorSortAttr.timestamp, .desc)
  let initialModel = VisitorScreenModel(
    pagination: Pagination.Model(items: .pending, page: 1, pageAmount: 0),
    selectedVisitor: nil,
    searchBar: searchBar,
    isDescriptionOpen: false
  )
  let (pagination, paginationCmd): (PaginationModel, Cmd<PaginationMsg>) =
    Pagination.initial(mkPaginationConfig(shared, initialModel), page: 1)

  var model = initialModel
  model.pagination = pagination
  return (
    model,
    .batch([paginationCmd.map(VisitorScreenMsg.paginationMsg), searchBarCmd.map(VisitorScreenMsg.searchBarMsg)])
  )
}

public func visitorScreenUpdate(_ shared: Shared) -> (VisitorScreenMsg, VisitorScreenModel) -> (VisitorScreenModel, Cmd<VisitorScreenMsg>) {
  { msg, model in
    switch msg {
    case .clearSelected:
      var updatedModel = model
      updatedModel.selectedVisitor = nil
      return (updatedModel, .none)
    case .toggleDescription:
      var updatedModel = model
      updatedModel.isDescriptionOpen.toggle()
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

private func searchBarMsgHandler(_ shared: Shared, _ subMsg: SearchBarMsg<VisitorSortAttr>, _ model: VisitorScreenModel) -> (VisitorScreenModel, Cmd<VisitorScreenMsg>) {
  let (searchBar, searchBarCmd) = searchBarUpdate(subMsg, model.searchBar)
  var updatedModel = model
  updatedModel.searchBar = searchBar

  return updateAndCmd { (m: VisitorScreenModel) -> (VisitorScreenModel, Cmd<VisitorScreenMsg>) in
    switch subMsg {
    case .submit, .changeSort, .changeDirection:
      let (pagination, paginationCmd): (PaginationModel, Cmd<PaginationMsg>) =
        Pagination.initial(mkPaginationConfig(shared, m), page: 1)
      var next = m
      next.pagination = pagination
      return (next, paginationCmd.map(VisitorScreenMsg.paginationMsg))
    case .changeSearchText:
      return (m, .none)
    }
  }((updatedModel, searchBarCmd.map(VisitorScreenMsg.searchBarMsg)))
}

private func paginationMsgHandler(_ shared: Shared, _ subMsg: PaginationMsg, _ model: VisitorScreenModel) -> (VisitorScreenModel, Cmd<VisitorScreenMsg>) {
  let (pagination, paginationCmd) = Pagination.update(mkPaginationConfig(shared, model))(subMsg, model.pagination)
  var updatedModel = model
  updatedModel.pagination = pagination

  return updateAndCmd { (m: VisitorScreenModel) -> (VisitorScreenModel, Cmd<VisitorScreenMsg>) in
    if case .itemMsg(let itemMsg, _) = subMsg {
      return paginationItemMsgHandler(itemMsg)(m)
    } else {
      return (m, .none)
    }
  }((updatedModel, paginationCmd.map(VisitorScreenMsg.paginationMsg)))
}

private func paginationItemMsgHandler(_ msg: VisitorScreenItemMsg) -> (VisitorScreenModel) -> (VisitorScreenModel, Cmd<VisitorScreenMsg>) {
  { m in
    switch msg {
    case .selectVisitor(let visitor):
      var updatedModel = m
      updatedModel.selectedVisitor = visitor
      return (updatedModel, .none)
    }
  }
}
