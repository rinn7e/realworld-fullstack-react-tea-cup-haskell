extension PaginationNav {
  enum PageItem: Equatable, Hashable {
    case page(Int)
    case ellipsis(Int)
  }

  /// Page buttons to show: every page when there are at most 7, otherwise the
  /// first/last page, the pages around the current one and ellipses. (Each ellipsis
  /// carries its place, so a list can tell the two apart.)
  static func getPaginationPageItems(_ currentPage: Int, _ pageAmount: Int) -> [PageItem] {
    if pageAmount <= 7 {
      return (1...max(pageAmount, 1)).prefix(pageAmount).map(PageItem.page)
    } else if currentPage <= 4 {
      return [1, 2, 3, 4, 5].map(PageItem.page) + [.ellipsis(1), .page(pageAmount)]
    } else if currentPage >= pageAmount - 3 {
      return [.page(1), .ellipsis(1)] + [4, 3, 2, 1, 0].map { .page(pageAmount - $0) }
    } else {
      return [.page(1), .ellipsis(1)] + [currentPage - 1, currentPage, currentPage + 1].map(PageItem.page)
        + [.ellipsis(2), .page(pageAmount)]
    }
  }
}
