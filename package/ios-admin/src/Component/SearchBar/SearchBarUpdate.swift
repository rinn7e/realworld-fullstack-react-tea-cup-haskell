import CommonType
import TeaCup

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
  var model = model
  switch msg {
  case .changeSearchText(let text):
    model.searchText = text
  case .changeSort(let sort):
    model.sort = sort
  case .changeDirection(let direction):
    model.direction = direction
  case .submit:
    break
  }
  return (model, .none)
}
