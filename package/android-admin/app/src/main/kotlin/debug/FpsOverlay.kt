package debug

import android.util.Log
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.runtime.withFrameNanos
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

// A frame rate counter drawn above the app, for finding where it lags. It asks
// for every frame of the screen (`withFrameNanos`, the choreographer); when the
// main thread is busy (a long `update`, a heavy composition), the next frame
// comes late, so the frame took longer. A frame more than 1.5 times its budget
// is a hitch: it is counted and logged (logcat, tag `Hitch`). A bottom sheet is
// a window of its own, drawn above this counter.

private const val TAG = "Hitch"

@Composable
fun FpsOverlay(modifier: Modifier = Modifier) {
  val refreshRate = LocalView.current.display?.refreshRate ?: 60f
  val budgetNanos = (1_000_000_000 / refreshRate).toLong()
  var fps by remember { mutableIntStateOf(0) }
  var worstFrameMs by remember { mutableFloatStateOf(0f) }
  var hitches by remember { mutableIntStateOf(0) }

  LaunchedEffect(budgetNanos) {
    var last = withFrameNanos { it }
    var windowStart = last
    var windowFrames = 0
    var windowWorst = 0L
    while (true) {
      val now = withFrameNanos { it }
      val frame = now - last
      last = now
      if (frame > budgetNanos * 3 / 2) {
        hitches += 1
        Log.w(TAG, "Hitch: ${frame / 1_000_000} ms frame (budget ${budgetNanos / 1_000_000} ms)")
      }
      windowFrames += 1
      windowWorst = maxOf(windowWorst, frame)
      // The numbers of the last half second
      if (now - windowStart >= 500_000_000) {
        fps = (windowFrames * 1_000_000_000L / (now - windowStart)).toInt()
        worstFrameMs = windowWorst / 1_000_000f
        windowStart = now
        windowFrames = 0
        windowWorst = 0
      }
    }
  }

  val ratio = fps / refreshRate
  val fpsColor = if (ratio > 0.9f) Color(0xFF4ADE80) else if (ratio > 0.6f) Color(0xFFFACC15) else Color(0xFFF87171)
  val style = TextStyle(fontFamily = FontFamily.Monospace, fontWeight = FontWeight.SemiBold, fontSize = 11.sp, color = Color.White)
  Row(
    modifier.statusBarsPadding().background(Color.Black.copy(alpha = 0.7f), CircleShape).padding(horizontal = 8.dp, vertical = 4.dp),
    horizontalArrangement = Arrangement.spacedBy(6.dp),
  ) {
    Text("$fps fps", style = style.copy(color = fpsColor))
    Text("worst ${worstFrameMs.toInt()} ms", style = style)
    Text("hitches $hitches", style = style)
  }
}
