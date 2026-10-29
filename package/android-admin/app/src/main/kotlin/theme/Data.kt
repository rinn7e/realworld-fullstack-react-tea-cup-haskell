package theme

// The presets of the web app. On Android the primary color is the primary of
// Material; the fonts of the web themes are left to the system font.
val themes: List<Theme> =
  listOf(
    Theme(id = "modernBlue", name = "Modern Blue", primaryColor = 0xFF2563EB, secondaryColor = 0xFF0F172A), // blue-600, slate-900
    Theme(id = "midnightPurple", name = "Midnight Purple", primaryColor = 0xFF7C3AED, secondaryColor = 0xFF020617), // violet-600, slate-950
    Theme(id = "emeraldForest", name = "Emerald Forest", primaryColor = 0xFF059669, secondaryColor = 0xFF064E3B), // emerald-600, emerald-950
  )

val defaultTheme = themes[0]
