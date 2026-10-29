// Module: Screen_CommentScreen

import Common_API_Type
import Common_Type
import Component_SearchBar
import Package_TeaCup
import Package_TeaCupPagination

private typealias PaginationModel = Pagination.Model<Comment, HttpError>
private typealias PaginationMsg = Pagination.Msg<Comment, CommentScreenItemMsg, HttpError>

public func commentScreenInitial(_ shared: Shared) -> (CommentScreenModel, Cmd<CommentScreenMsg>) {
  let (searchBar, searchBarCmd) = searchBarInitial("", CommentSortAttr.createdAt, .desc)
  let initialModel = CommentScreenModel(
    pagination: Pagination.Model(items: .pending, page: 1, pageAmount: 0),
    selectedComment: nil,
    searchBar: searchBar
  )
  let (pagination, paginationCmd): (PaginationModel, Cmd<PaginationMsg>) =
    Pagination.initial(mkPaginationConfig(shared, initialModel), page: 1)

  var model = initialModel
  model.pagination = pagination
  return (
    model,
    .batch([paginationCmd.map(CommentScreenMsg.paginationMsg), searchBarCmd.map(CommentScreenMsg.searchBarMsg)])
  )
}

public func commentScreenUpdate(_ shared: Shared) -> (CommentScreenMsg, CommentScreenModel) -> (CommentScreenModel, Cmd<CommentScreenMsg>) {
  { msg, model in
    switch msg {
    case .clearSelected:
      var updatedModel = model
      updatedModel.selectedComment = nil
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

private func searchBarMsgHandler(_ shared: Shared, _ subMsg: SearchBarMsg<CommentSortAttr>, _ model: CommentScreenModel) -> (CommentScreenModel, Cmd<CommentScreenMsg>) {
  let (searchBar, searchBarCmd) = searchBarUpdate(subMsg, model.searchBar)
  var updatedModel = model
  updatedModel.searchBar = searchBar

  return updateAndCmd { (m: CommentScreenModel) -> (CommentScreenModel, Cmd<CommentScreenMsg>) in
    switch subMsg {
    case .submit, .changeSort, .changeDirection:
      let (pagination, paginationCmd): (PaginationModel, Cmd<PaginationMsg>) =
        Pagination.initial(mkPaginationConfig(shared, m), page: 1)
      var next = m
      next.pagination = pagination
      return (next, paginationCmd.map(CommentScreenMsg.paginationMsg))
    case .changeSearchText:
      return (m, .none)
    }
  }((updatedModel, searchBarCmd.map(CommentScreenMsg.searchBarMsg)))
}

private func paginationMsgHandler(_ shared: Shared, _ subMsg: PaginationMsg, _ model: CommentScreenModel) -> (CommentScreenModel, Cmd<CommentScreenMsg>) {
  let (pagination, paginationCmd) = Pagination.update(mkPaginationConfig(shared, model))(subMsg, model.pagination)
  var updatedModel = model
  updatedModel.pagination = pagination

  return updateAndCmd { (m: CommentScreenModel) -> (CommentScreenModel, Cmd<CommentScreenMsg>) in
    if case .itemMsg(let itemMsg, _) = subMsg {
      return paginationItemMsgHandler(itemMsg)(m)
    } else {
      return (m, .none)
    }
  }((updatedModel, paginationCmd.map(CommentScreenMsg.paginationMsg)))
}

private func paginationItemMsgHandler(_ msg: CommentScreenItemMsg) -> (CommentScreenModel) -> (CommentScreenModel, Cmd<CommentScreenMsg>) {
  { m in
    switch msg {
    case .selectComment(let comment):
      var updatedModel = m
      updatedModel.selectedComment = comment
      return (updatedModel, .none)
    }
  }
}
