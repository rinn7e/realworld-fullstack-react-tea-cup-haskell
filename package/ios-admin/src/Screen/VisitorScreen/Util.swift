// Module: Screen_VisitorScreen

import Common_API_Handler
import Common_API_Type
import Common_Type
import Package_TeaCupPagination

struct SearchParams {
  var ip: String?
  var path: String?
}

func getSearchParams(_ searchText: String) -> SearchParams {
  let trimmed = searchText.trimmingCharacters(in: .whitespaces)
  if trimmed.isEmpty {
    return SearchParams()
  } else if trimmed.hasPrefix("/") {
    return SearchParams(path: trimmed)
  } else {
    return SearchParams(ip: trimmed)
  }
}

func mkPaginationConfig(_ shared: Shared, _ model: VisitorScreenModel) -> Pagination.Config<Visitor, HttpError> {
  Pagination.Config(
    handler: { offset, limit in
      guard let token = shared.token else { return .failure(.notAuthenticated) }
      let params = getSearchParams(model.searchBar.searchText)
      return await getVisitors(token, limit: limit, offset: offset, ip: params.ip, path: params.path)
        .map { Pagination.Page(items: $0.visitors, totalCount: $0.totalCount) }
    },
    limit: GET_VISITORS_LIMIT
  )
}
