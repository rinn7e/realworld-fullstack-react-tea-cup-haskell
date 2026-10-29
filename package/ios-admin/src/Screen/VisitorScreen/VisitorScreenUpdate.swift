import CommonAPIType
import CommonType
import TeaCup
import TeaCupPagination

extension VisitorScreen {
  private typealias PaginationModel = Pagination.Model<Visitor, HttpError>
  private typealias PaginationMsg = Pagination.Msg<Visitor, VisitorItemMsg, HttpError>

  static func initial(_ shared: Shared) -> (Model, Cmd<Msg>) {
    let (searchBar, searchBarCmd) = SearchBar.initial("", VisitorSortAttr.timestamp, .desc)
    let initialModel = Model(
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
      .batch([paginationCmd.map(Msg.paginationMsg), searchBarCmd.map(Msg.searchBarMsg)])
    )
  }

  static func update(_ shared: Shared) -> (Msg, Model) -> (Model, Cmd<Msg>) {
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

  private static func searchBarMsgHandler(_ shared: Shared, _ subMsg: SearchBar.Msg<VisitorSortAttr>, _ model: Model) -> (Model, Cmd<Msg>) {
    let (searchBar, searchBarCmd) = SearchBar.update(subMsg, model.searchBar)
    var updatedModel = model
    updatedModel.searchBar = searchBar

    return updateAndCmd { (m: Model) -> (Model, Cmd<Msg>) in
      switch subMsg {
      case .submit, .changeSort, .changeDirection:
        let (pagination, paginationCmd): (PaginationModel, Cmd<PaginationMsg>) =
          Pagination.initial(mkPaginationConfig(shared, m), page: 1)
        var next = m
        next.pagination = pagination
        return (next, paginationCmd.map(Msg.paginationMsg))
      case .changeSearchText:
        return (m, .none)
      }
    }((updatedModel, searchBarCmd.map(Msg.searchBarMsg)))
  }

  private static func paginationMsgHandler(_ shared: Shared, _ subMsg: PaginationMsg, _ model: Model) -> (Model, Cmd<Msg>) {
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

  private static func paginationItemMsgHandler(_ msg: VisitorItemMsg) -> (Model) -> (Model, Cmd<Msg>) {
    { m in
      switch msg {
      case .selectVisitor(let visitor):
        var updatedModel = m
        updatedModel.selectedVisitor = visitor
        return (updatedModel, .none)
      }
    }
  }
}
