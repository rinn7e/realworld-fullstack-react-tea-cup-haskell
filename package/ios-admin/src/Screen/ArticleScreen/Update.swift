// Module: Screen_ArticleScreen

import Common_API_Type
import Common_Type
import Component_SearchBar
import Package_TeaCup
import Package_TeaCupPagination

private typealias PaginationModel = Pagination.Model<Article, HttpError>
private typealias PaginationMsg = Pagination.Msg<Article, ArticleScreenItemMsg, HttpError>

public func articleScreenInitial(_ shared: Shared) -> (ArticleScreenModel, Cmd<ArticleScreenMsg>) {
  let (searchBar, searchBarCmd) = searchBarInitial("", ArticleSortAttr.createdAt, .desc)
  let initialModel = ArticleScreenModel(
    pagination: Pagination.Model(items: .pending, page: 1, pageAmount: 0),
    selectedArticle: nil,
    searchBar: searchBar
  )
  let (pagination, paginationCmd): (PaginationModel, Cmd<PaginationMsg>) =
    Pagination.initial(mkPaginationConfig(shared, initialModel), page: 1)

  var model = initialModel
  model.pagination = pagination
  return (
    model,
    .batch([paginationCmd.map(ArticleScreenMsg.paginationMsg), searchBarCmd.map(ArticleScreenMsg.searchBarMsg)])
  )
}

public func articleScreenUpdate(_ shared: Shared) -> (ArticleScreenMsg, ArticleScreenModel) -> (ArticleScreenModel, Cmd<ArticleScreenMsg>) {
  { msg, model in
    switch msg {
    case .clearSelected:
      var updatedModel = model
      updatedModel.selectedArticle = nil
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

private func searchBarMsgHandler(_ shared: Shared, _ subMsg: SearchBarMsg<ArticleSortAttr>, _ model: ArticleScreenModel) -> (ArticleScreenModel, Cmd<ArticleScreenMsg>) {
  let (searchBar, searchBarCmd) = searchBarUpdate(subMsg, model.searchBar)
  var updatedModel = model
  updatedModel.searchBar = searchBar

  return updateAndCmd { (m: ArticleScreenModel) -> (ArticleScreenModel, Cmd<ArticleScreenMsg>) in
    switch subMsg {
    case .submit, .changeSort, .changeDirection:
      let (pagination, paginationCmd): (PaginationModel, Cmd<PaginationMsg>) =
        Pagination.initial(mkPaginationConfig(shared, m), page: 1)
      var next = m
      next.pagination = pagination
      return (next, paginationCmd.map(ArticleScreenMsg.paginationMsg))
    case .changeSearchText:
      return (m, .none)
    }
  }((updatedModel, searchBarCmd.map(ArticleScreenMsg.searchBarMsg)))
}

private func paginationMsgHandler(_ shared: Shared, _ subMsg: PaginationMsg, _ model: ArticleScreenModel) -> (ArticleScreenModel, Cmd<ArticleScreenMsg>) {
  let (pagination, paginationCmd) = Pagination.update(mkPaginationConfig(shared, model))(subMsg, model.pagination)
  var updatedModel = model
  updatedModel.pagination = pagination

  return updateAndCmd { (m: ArticleScreenModel) -> (ArticleScreenModel, Cmd<ArticleScreenMsg>) in
    if case .itemMsg(let itemMsg, _) = subMsg {
      return paginationItemMsgHandler(itemMsg)(m)
    } else {
      return (m, .none)
    }
  }((updatedModel, paginationCmd.map(ArticleScreenMsg.paginationMsg)))
}

private func paginationItemMsgHandler(_ msg: ArticleScreenItemMsg) -> (ArticleScreenModel) -> (ArticleScreenModel, Cmd<ArticleScreenMsg>) {
  { m in
    switch msg {
    case .selectArticle(let article):
      var updatedModel = m
      updatedModel.selectedArticle = article
      return (updatedModel, .none)
    }
  }
}
