package teacuppagination

import teacup.Cmd
import teacup.Either
import teacup.RemoteData
import kotlin.math.ceil

// A paged list, ported from `@rinn7e/tea-cup-pagination`: the model holds the
// page shown and its items, `update` fetches a page through `Config.handler`.
// The views draw the items themselves (`renderItems` of the web package is a
// view, so it lives in each screen here).

data class Page<out Item>(val items: List<Item>, val totalCount: Int)

class Config<Item, Err>(
  val handler: suspend (offset: Int, limit: Int) -> Either<Err, Page<Item>>,
  val limit: Int,
)

data class Model<out Item, out Err>(
  val items: RemoteData<Err, List<Item>>,
  val page: Int,
  val pageAmount: Int,
)

sealed interface Msg<out Item, out IMsg, out Err> {
  data class ChangePage(val page: Int) : Msg<Nothing, Nothing, Nothing>

  data class FetchResponse<out Item, out Err>(val page: Int, val result: Either<Err, Page<Item>>) :
    Msg<Item, Nothing, Err>

  data class ItemMsg<out Item, out IMsg>(val msg: IMsg, val item: Item) : Msg<Item, IMsg, Nothing>

  data object NoOp : Msg<Nothing, Nothing, Nothing>
}

fun <Item, Err> initial(config: Config<Item, Err>, page: Int = 1): Pair<Model<Item, Err>, Cmd<Msg<Item, Nothing, Err>>> =
  Model<Item, Err>(items = RemoteData.Pending, page = page, pageAmount = 0) to fetchCmd(config, page)

fun <Item, Err> update(
  config: Config<Item, Err>,
  msg: Msg<Item, *, Err>,
  model: Model<Item, Err>,
): Pair<Model<Item, Err>, Cmd<Msg<Item, Nothing, Err>>> =
  when (msg) {
    is Msg.ChangePage ->
      if (msg.page == model.page) {
        model to Cmd.none
      } else {
        model.copy(page = msg.page, items = RemoteData.Pending) to fetchCmd(config, msg.page)
      }

    is Msg.FetchResponse ->
      // A late answer for a page left already is dropped
      if (msg.page != model.page) {
        model to Cmd.none
      } else {
        when (val result = msg.result) {
          is Either.Right ->
            model.copy(
              items = RemoteData.Success(result.value.items),
              pageAmount = ceil(result.value.totalCount.toDouble() / config.limit).toInt(),
            ) to Cmd.none

          is Either.Left -> model.copy(items = RemoteData.Failure(result.value)) to Cmd.none
        }
      }

    is Msg.ItemMsg, Msg.NoOp -> model to Cmd.none
  }

private fun <Item, Err> fetchCmd(config: Config<Item, Err>, page: Int): Cmd<Msg<Item, Nothing, Err>> {
  val offset = (page - 1) * config.limit
  return Cmd.attempt({ config.handler(offset, config.limit) }) { result -> Msg.FetchResponse(page, result) }
}
