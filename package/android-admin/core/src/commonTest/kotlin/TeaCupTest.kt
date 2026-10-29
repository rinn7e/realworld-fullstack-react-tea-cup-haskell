import kotlinx.coroutines.test.runTest
import teacup.Cmd
import teacup.Dispatcher
import teacup.Either
import teacup.updateAndCmd
import kotlin.test.Test
import kotlin.test.assertEquals

class TeaCupTest {
  // Runs every effect of a command in turn and collects the messages it sends
  private suspend fun <Msg> sent(cmd: Cmd<Msg>): List<Msg> {
    val messages = mutableListOf<Msg>()
    val dispatch = Dispatcher<Msg> { messages.add(it) }
    for (effect in cmd.effects) effect(dispatch)
    return messages
  }

  @Test
  fun mapWrapsEveryMessage() = runTest {
    val cmd = Cmd.batch(Cmd.succeed(1), Cmd.succeed(2)).map { "n$it" }
    assertEquals(listOf("n1", "n2"), sent(cmd))
  }

  @Test
  fun attemptSendsTheResult() = runTest {
    val cmd = Cmd.attempt({ Either.Right(41) }) { result -> (result as Either.Right).value + 1 }
    assertEquals(listOf(42), sent(cmd))
  }

  @Test
  fun noneSendsNothing() = runTest {
    assertEquals(emptyList(), sent(Cmd.none))
  }

  @Test
  fun updateAndCmdKeepsBothCommands() = runTest {
    val (model, cmd) = updateAndCmd { m: Int -> (m + 1) to Cmd.succeed("second") }(1 to Cmd.succeed("first"))
    assertEquals(2, model)
    assertEquals(listOf("first", "second"), sent(cmd))
  }
}
