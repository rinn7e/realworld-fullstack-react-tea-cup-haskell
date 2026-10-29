import Common_API_Type
import Component_SearchBar
import Package_TeaCupPagination

let GET_VISITORS_LIMIT = 50

public struct VisitorScreenModel: Equatable {
  var pagination: Pagination.Model<Visitor, HttpError>
  var selectedVisitor: Visitor?
  var searchBar: SearchBarModel<VisitorSortAttr>
  var isDescriptionOpen: Bool
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
