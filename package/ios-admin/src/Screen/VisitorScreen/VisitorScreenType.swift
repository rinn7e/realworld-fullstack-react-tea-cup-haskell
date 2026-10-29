import CommonAPIType
import ComponentSearchBar
import TeaCupPagination

enum VisitorScreen {
  static let GET_VISITORS_LIMIT = 50

  struct Model: Equatable {
    var pagination: Pagination.Model<Visitor, HttpError>
    var selectedVisitor: Visitor?
    var searchBar: SearchBarModel<VisitorSortAttr>
    var isDescriptionOpen: Bool
  }

  enum VisitorItemMsg {
    case selectVisitor(Visitor?)
  }

  enum Msg {
    case noOp
    case clearSelected
    case toggleDescription
    case searchBarMsg(SearchBarMsg<VisitorSortAttr>)
    case paginationMsg(Pagination.Msg<Visitor, VisitorItemMsg, HttpError>)
  }
}
