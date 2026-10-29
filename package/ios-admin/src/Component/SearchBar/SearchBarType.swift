import CommonType

enum SearchBar {
  struct SearchOption<Sort> {
    let label: String
    let value: Sort
  }

  struct Model<Sort: Equatable>: Equatable {
    var searchText: String
    var sort: Sort
    var direction: Direction
  }

  enum Msg<Sort> {
    case changeSearchText(String)
    case changeSort(Sort)
    case changeDirection(Direction)
    case submit
  }
}
