// Module: SentinelAdmin (the app target, project.yml)

import Common_Type_Destination

// Where the app is, read from the models that show it, never stored: the screen
// is the screen model's. The tab bar shows it, and a deep link moves it.
func destinationOf(_ model: Model) -> Destination {
  Destination(screen: currentScreenOf(model.screenModel.screenModel))
}
