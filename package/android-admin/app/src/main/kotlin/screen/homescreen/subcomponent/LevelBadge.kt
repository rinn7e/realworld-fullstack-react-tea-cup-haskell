package screen.homescreen.subcomponent

import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import common.api.type.LogLevel
import component.rolebadge.Badge

@Composable
fun LevelBadge(level: LogLevel) {
  Badge(level.name, levelColor(level))
}

fun levelColor(level: LogLevel): Color =
  when (level) {
    LogLevel.ERROR -> Color(0xFFDC2626)
    LogLevel.WARNING -> Color(0xFFEA580C)
    LogLevel.INFO -> Color(0xFF2563EB)
    LogLevel.DEBUG -> Color(0xFF6B7280)
  }
