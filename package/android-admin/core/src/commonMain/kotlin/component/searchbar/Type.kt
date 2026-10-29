package component.searchbar

import common.type.Direction

data class Option<out Sort>(val label: String, val value: Sort)

// Read anywhere (a screen builds its query from it), changed only by the search
// bar (`initial`, `update`)
data class Model<out Sort>(
  val searchText: String,
  val sort: Sort,
  val direction: Direction,
)

sealed interface Msg<out Sort> {
  data class ChangeSearchText(val text: String) : Msg<Nothing>

  data class ChangeSort<out Sort>(val sort: Sort) : Msg<Sort>

  data class ChangeDirection(val direction: Direction) : Msg<Nothing>

  data object Submit : Msg<Nothing>
}
