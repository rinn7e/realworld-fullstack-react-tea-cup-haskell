// Module: Screen_VisitorScreen_Util

import Common_API_Handler_Dashboard
import Common_API_Type_Common
import Common_API_Type_Visitor
import Common_Type_Shared
import Package_TeaCupPagination_Pagination
@_spi(Screen_VisitorScreen) import Screen_VisitorScreen_Type

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

@_spi(Screen_VisitorScreen) public func mkPaginationConfig(_ shared: Shared, _ model: VisitorScreenModel) -> Pagination.Config<Visitor, HttpError> {
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
