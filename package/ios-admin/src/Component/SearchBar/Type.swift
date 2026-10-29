// Module: Component_SearchBar_Type

import Common_Type_Filter

public struct SearchBarOption<Sort> {
  @_spi(Component_SearchBar) public let label: String
  @_spi(Component_SearchBar) public let value: Sort

  public init(label: String, value: Sort) {
    self.label = label
    self.value = value
  }
}

// Read anywhere (a screen builds its query from it), made only by the search
// bar (`searchBarInitial`, `searchBarUpdate`): its initializer is the internal
// part of the folder
public struct SearchBarModel<Sort: Equatable>: Equatable {
  public let searchText: String
  public let sort: Sort
  public let direction: Direction

  @_spi(Component_SearchBar) public init(searchText: String, sort: Sort, direction: Direction) {
    self.searchText = searchText
    self.sort = sort
    self.direction = direction
  }
}

public enum SearchBarMsg<Sort> {
  case changeSearchText(String)
  case changeSort(Sort)
  case changeDirection(Direction)
  case submit
}
