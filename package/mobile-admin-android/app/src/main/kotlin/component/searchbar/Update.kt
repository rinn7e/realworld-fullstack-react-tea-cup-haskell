package component.searchbar

import common.type.Direction
import teacup.Cmd

fun <Sort> initial(initialSearchText: String, initialSort: Sort, initialDirection: Direction): Pair<Model<Sort>, Cmd<Msg<Sort>>> =
  Model(searchText = initialSearchText, sort = initialSort, direction = initialDirection) to Cmd.none

fun <Sort> update(msg: Msg<Sort>, model: Model<Sort>): Pair<Model<Sort>, Cmd<Msg<Sort>>> =
  when (msg) {
    is Msg.ChangeSearchText -> model.copy(searchText = msg.text) to Cmd.none
    is Msg.ChangeSort -> model.copy(sort = msg.sort) to Cmd.none
    is Msg.ChangeDirection -> model.copy(direction = msg.direction) to Cmd.none
    Msg.Submit -> model to Cmd.none
  }
