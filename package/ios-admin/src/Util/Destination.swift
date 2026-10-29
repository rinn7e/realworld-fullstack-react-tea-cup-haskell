// Module: App_Util_Destination

@_spi(App) import App_Type
import Common_Type_Destination_Type

// Where the app is, read from the models that show it, never stored: the screen
// is the screen model's. The tab bar shows it, and a deep link moves it.
@_spi(App) public func destinationOf(_ model: Model) -> Destination {
  Destination(screen: currentScreenOf(model.screenModel.screenModel))
}
