package app.util

import app.Model
import app.currentScreenOf
import common.type.destination.Destination

// Where the app is, read from the models that show it, never stored: the screen
// is the screen model's. The tab bar shows it, and a deep link moves it.
fun destinationOf(model: Model): Destination = Destination(currentScreenOf(model.screenModel.screenModel))
