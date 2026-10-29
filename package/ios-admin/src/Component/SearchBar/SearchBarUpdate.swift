import TeaCup

extension SearchBar {
  static func initial<Sort>(
    _ initialSearchText: String,
    _ initialSort: Sort,
    _ initialDirection: Direction
  ) -> (Model<Sort>, Cmd<Msg<Sort>>) {
    (Model(searchText: initialSearchText, sort: initialSort, direction: initialDirection), .none)
  }

  static func update<Sort>(_ msg: Msg<Sort>, _ model: Model<Sort>) -> (Model<Sort>, Cmd<Msg<Sort>>) {
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
}
