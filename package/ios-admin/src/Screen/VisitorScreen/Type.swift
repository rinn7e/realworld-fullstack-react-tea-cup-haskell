// Module: Screen_VisitorScreen_Type

import Common_API_Type_Common
import Common_API_Type_Visitor
import Component_SearchBar_Type
import Package_TeaCupPagination_Pagination

@_spi(Screen_VisitorScreen) public let GET_VISITORS_LIMIT = 50

public struct VisitorScreenModel: Equatable {
  @_spi(Screen_VisitorScreen) public var pagination: Pagination.Model<Visitor, HttpError>
  @_spi(Screen_VisitorScreen) public var selectedVisitor: Visitor?
  @_spi(Screen_VisitorScreen) public var searchBar: SearchBarModel<VisitorSortAttr>
  @_spi(Screen_VisitorScreen) public var isDescriptionOpen: Bool

  @_spi(Screen_VisitorScreen) public init(pagination: Pagination.Model<Visitor, HttpError>, selectedVisitor: Visitor? = nil, searchBar: SearchBarModel<VisitorSortAttr>, isDescriptionOpen: Bool) {
    self.pagination = pagination
    self.selectedVisitor = selectedVisitor
    self.searchBar = searchBar
    self.isDescriptionOpen = isDescriptionOpen
  }
}

public enum VisitorScreenItemMsg {
  case selectVisitor(Visitor?)
}

public enum VisitorScreenMsg {
  case noOp
  case clearSelected
  case toggleDescription
  case searchBarMsg(SearchBarMsg<VisitorSortAttr>)
  case paginationMsg(Pagination.Msg<Visitor, VisitorScreenItemMsg, HttpError>)
}
