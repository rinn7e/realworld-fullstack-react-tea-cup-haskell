// Module: App_Program

@_spi(App) import App_App
@_spi(App) import App_Type
@_spi(App) import App_Update
@_spi(App) import App_Util_URL
import Common_Type_Destination_Type
import Package_TeaCup_Cmd
import Package_TeaCup_Dispatcher
import Package_TeaCup_Program
import SwiftUI

// The model of the program: none until `initialize` builds it (the `null` model
// of the web program). A deep link that opened the app arrives while the boot
// checks the token, so it is kept as the destination to boot on.
@_spi(App) public enum ProgramModel: Equatable {
  case booting(bootDestination: Destination)
  case ready(Model)
}

func preInit() -> (ProgramModel, Cmd<Msg>) {
  (.booting(bootDestination: bootDestinationOf()), initializeCmd())
}

func preUpdate(_ msg: Msg, _ programModel: ProgramModel) -> (ProgramModel, Cmd<Msg>) {
  switch (programModel, msg) {
  case (.booting(let bootDestination), .initialize(let user, let isUnavailable, let token)):
    let (model, cmd) = initialModel(bootDestination, user: user, isUnavailable: isUnavailable, token: token)
    return (.ready(model), cmd)
  case (.booting, .navigationMsg(.urlChanged(let destination))):
    return (.booting(bootDestination: destination), .none)
  case (.booting, _):
    return (programModel, .none)
  case (.ready(let model), _):
    let (newModel, cmd) = update(msg, model)
    return (.ready(newModel), cmd)
  }
}

@_spi(App) public struct PreView: View, Equatable {
  let programModel: ProgramModel
  let dispatch: Dispatcher<Msg>

  public var body: some View {
    switch programModel {
    case .booting:
      ProgressView().controlSize(.large)
    case .ready(let model):
      AppView(model: model, dispatch: dispatch)
    }
  }
}

@_spi(App) public let appProgram = Program(
  init: preInit,
  update: preUpdate,
  view: PreView.init,
  onOpenUrl: urlChangedMsg
)
