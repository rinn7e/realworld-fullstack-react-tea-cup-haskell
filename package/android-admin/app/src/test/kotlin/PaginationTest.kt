import teacup.Cmd
import teacup.Either
import teacup.RemoteData
import teacuppagination.Config
import teacuppagination.Model
import teacuppagination.Msg
import teacuppagination.Page
import teacuppagination.initial
import teacuppagination.update
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertSame

class PaginationTest {
  private val config = Config<String, String>(handler = { _, _ -> Either.Right(Page(emptyList(), 0)) }, limit = 10)

  @Test
  fun initialIsPendingAndFetches() {
    val (model, cmd) = initial(config, page = 2)
    assertEquals(Model(RemoteData.Pending, page = 2, pageAmount = 0), model)
    assertEquals(1, cmd.effects.size)
  }

  @Test
  fun changingToThePageShownDoesNothing() {
    val model = Model<String, String>(RemoteData.Success(listOf("a")), page = 1, pageAmount = 3)
    val (next, cmd) = update(config, Msg.ChangePage(1), model)
    assertEquals(model, next)
    assertSame(Cmd.none, cmd)
  }

  @Test
  fun answerSetsItemsAndPageAmount() {
    val model = Model<String, String>(RemoteData.Pending, page = 1, pageAmount = 0)
    val (next, _) = update(config, Msg.FetchResponse(1, Either.Right(Page(listOf("a", "b"), 21))), model)
    assertEquals(RemoteData.Success(listOf("a", "b")), next.items)
    assertEquals(3, next.pageAmount)
  }

  @Test
  fun lateAnswerForAnotherPageIsDropped() {
    val model = Model<String, String>(RemoteData.Pending, page = 2, pageAmount = 3)
    val (next, _) = update(config, Msg.FetchResponse(1, Either.Right(Page(listOf("old"), 21))), model)
    assertEquals(model, next)
  }

  @Test
  fun failureIsKept() {
    val model = Model<String, String>(RemoteData.Pending, page = 1, pageAmount = 0)
    val (next, _) = update(config, Msg.FetchResponse(1, Either.Left("boom")), model)
    assertEquals(RemoteData.Failure("boom"), next.items)
  }
}
