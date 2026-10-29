package theme

/**
 * A preset of the web app. The colors are ARGB (`0xFF2563EB`), so this module
 * stays free of any UI toolkit; the views turn them into colors.
 */
data class Theme(
  val id: String,
  val name: String,
  val primaryColor: Long,
  val secondaryColor: Long,
) {
  // Nested: a top-level `ColorScheme` would clash with the one of Material in
  // every view that uses both
  enum class ColorScheme(val value: String) {
    Light("light"),
    Dark("dark"),
    Auto("auto"),
  }
}
