package theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import android.app.Activity
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat
import androidx.compose.ui.graphics.Color

/** The Material theme of a preset and a color scheme choice (`Auto` follows the system) */
@Composable
fun AppTheme(theme: Theme, colorScheme: Theme.ColorScheme, content: @Composable () -> Unit) {
  val isDark =
    when (colorScheme) {
      Theme.ColorScheme.Light -> false
      Theme.ColorScheme.Dark -> true
      Theme.ColorScheme.Auto -> isSystemInDarkTheme()
    }
  val primary = Color(theme.primaryColor)
  val colors = if (isDark) darkColorScheme(primary = primary, secondary = primary) else lightColorScheme(primary = primary, secondary = primary)
  // The icons of the system bars follow the scheme of the app, not of the
  // system: dark icons on a light app, light icons on a dark one
  val view = LocalView.current
  if (!view.isInEditMode) {
    SideEffect {
      val window = (view.context as Activity).window
      WindowCompat.getInsetsController(window, view).apply {
        isAppearanceLightStatusBars = !isDark
        isAppearanceLightNavigationBars = !isDark
      }
    }
  }
  MaterialTheme(colorScheme = colors, content = content)
}
