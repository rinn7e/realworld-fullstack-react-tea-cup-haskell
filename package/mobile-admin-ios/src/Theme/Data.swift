// Module: Theme_Data

import SwiftUI
@_spi(Theme) import Theme_Type

// The presets of the web app. On iOS the primary color is the tint of the app;
// the fonts of the web themes are left to the system font.
public let themes: [Theme] = [
  Theme(
    id: "modernBlue",
    name: "Modern Blue",
    primaryColor: Color(red: 0x25 / 255, green: 0x63 / 255, blue: 0xEB / 255),  // blue-600
    secondaryColor: Color(red: 0x0F / 255, green: 0x17 / 255, blue: 0x2A / 255)  // slate-900
  ),
  Theme(
    id: "midnightPurple",
    name: "Midnight Purple",
    primaryColor: Color(red: 0x7C / 255, green: 0x3A / 255, blue: 0xED / 255),  // violet-600
    secondaryColor: Color(red: 0x02 / 255, green: 0x06 / 255, blue: 0x17 / 255)  // slate-950
  ),
  Theme(
    id: "emeraldForest",
    name: "Emerald Forest",
    primaryColor: Color(red: 0x05 / 255, green: 0x96 / 255, blue: 0x69 / 255),  // emerald-600
    secondaryColor: Color(red: 0x06 / 255, green: 0x4E / 255, blue: 0x3B / 255)  // emerald-950
  ),
]

public let defaultTheme = themes[0]
