// Module: Component_SearchBar

import Common_Type

public struct SearchBarOption<Sort> {
  let label: String
  let value: Sort

  public init(label: String, value: Sort) {
    self.label = label
    self.value = value
  }
}

// Read anywhere (a screen builds its query from it), changed only by
// `searchBarUpdate`
public struct SearchBarModel<Sort: Equatable>: Equatable {
  public internal(set) var searchText: String
  public internal(set) var sort: Sort
  public internal(set) var direction: Direction
}

public enum SearchBarMsg<Sort> {
  case changeSearchText(String)
  case changeSort(Sort)
  case changeDirection(Direction)
  case submit
}
