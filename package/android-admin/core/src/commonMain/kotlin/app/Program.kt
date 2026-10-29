package app

import app.util.bootDestinationOf
import app.util.urlChangedMsg
import common.type.destination.Destination
import common.type.destination.NavigationMsg
import teacup.Cmd
import teacup.Program

// The model of the program: none until `Initialize` builds it (the `null` model
// of the web program). A deep link that opened the app arrives while the boot
// checks the token, so it is kept as the destination to boot on.
sealed interface ProgramModel {
  data class Booting(val bootDestination: Destination) : ProgramModel

  data class Ready(val model: Model) : ProgramModel
}

private fun preInit(): Pair<ProgramModel, Cmd<Msg>> = ProgramModel.Booting(bootDestinationOf()) to initializeCmd()

private fun preUpdate(msg: Msg, programModel: ProgramModel): Pair<ProgramModel, Cmd<Msg>> =
  when (programModel) {
    is ProgramModel.Booting ->
      when {
        msg is Msg.Initialize ->
          initialModel(programModel.bootDestination, msg).let { (model, cmd) -> ProgramModel.Ready(model) to cmd }

        msg is Msg.NavigationMsg && msg.msg is NavigationMsg.UrlChanged ->
          ProgramModel.Booting((msg.msg as NavigationMsg.UrlChanged).destination) to Cmd.none

        else -> programModel to Cmd.none
      }

    is ProgramModel.Ready -> update(msg, programModel.model).let { (model, cmd) -> ProgramModel.Ready(model) to cmd }
  }

val appProgram: Program<ProgramModel, Msg> = Program(init = ::preInit, update = ::preUpdate, onOpenUrl = ::urlChangedMsg)
