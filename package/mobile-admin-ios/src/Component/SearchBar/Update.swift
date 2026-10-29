// Module: Component_SearchBar_Update

import Common_Type_Filter
@_spi(Component_SearchBar) import Component_SearchBar_Type
import Package_TeaCup_Cmd

public func searchBarInitial<Sort>(
  _ initialSearchText: String,
  _ initialSort: Sort,
  _ initialDirection: Direction
) -> (SearchBarModel<Sort>, Cmd<SearchBarMsg<Sort>>) {
  (SearchBarModel(searchText: initialSearchText, sort: initialSort, direction: initialDirection), .none)
}

public func searchBarUpdate<Sort>(
  _ msg: SearchBarMsg<Sort>,
  _ model: SearchBarModel<Sort>
) -> (SearchBarModel<Sort>, Cmd<SearchBarMsg<Sort>>) {
  switch msg {
  case .changeSearchText(let text):
    return (SearchBarModel(searchText: text, sort: model.sort, direction: model.direction), .none)
  case .changeSort(let sort):
    return (SearchBarModel(searchText: model.searchText, sort: sort, direction: model.direction), .none)
  case .changeDirection(let direction):
    return (SearchBarModel(searchText: model.searchText, sort: model.sort, direction: direction), .none)
  case .submit:
    return (model, .none)
  }
}
