package screen.homescreen.subcomponent

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.patrykandpatrick.vico.compose.cartesian.CartesianChartHost
import com.patrykandpatrick.vico.compose.cartesian.axis.HorizontalAxis
import com.patrykandpatrick.vico.compose.cartesian.axis.VerticalAxis
import com.patrykandpatrick.vico.compose.cartesian.data.CartesianChartModel
import com.patrykandpatrick.vico.compose.cartesian.data.CartesianValueFormatter
import com.patrykandpatrick.vico.compose.cartesian.data.LineCartesianLayerModel
import com.patrykandpatrick.vico.compose.cartesian.layer.LineCartesianLayer
import com.patrykandpatrick.vico.compose.cartesian.layer.rememberLine
import com.patrykandpatrick.vico.compose.cartesian.layer.rememberLineCartesianLayer
import com.patrykandpatrick.vico.compose.cartesian.rememberCartesianChart
import com.patrykandpatrick.vico.compose.common.Fill
import com.patrykandpatrick.vico.compose.common.ProvideVicoTheme
import com.patrykandpatrick.vico.compose.m3.common.rememberM3VicoTheme
import common.api.type.VisitorStat

/**
 * The visitors of each period, as the area chart of the web app. The chart takes
 * its data as a value (`CartesianChartHost` with a model), so it draws the
 * model like any other view, with no producer to feed.
 */
@Composable
fun VisitorChart(stats: List<VisitorStat>) {
  // The axes and labels in the colors of the Material theme (light or dark)
  ProvideVicoTheme(rememberM3VicoTheme()) { Chart(stats) }
}

@Composable
private fun Chart(stats: List<VisitorStat>) {
  val primary = MaterialTheme.colorScheme.primary
  val model = remember(stats) { CartesianChartModel(LineCartesianLayerModel.build { series(stats.map { it.visitors }) }) }
  val periodLabels = remember(stats) { CartesianValueFormatter { _, x, _ -> stats.getOrNull(x.toInt())?.name ?: "" } }
  val line =
    LineCartesianLayer.rememberLine(
      fill = remember(primary) { LineCartesianLayer.LineFill.single(Fill(primary)) },
      areaFill =
        remember(primary) {
          LineCartesianLayer.AreaFill.single(Fill(Brush.verticalGradient(listOf(primary.copy(alpha = 0.25f), Color.Transparent))))
        },
      interpolator = LineCartesianLayer.Interpolator.cubic(),
    )
  val chart =
    rememberCartesianChart(
      rememberLineCartesianLayer(LineCartesianLayer.LineProvider.series(line)),
      startAxis = VerticalAxis.rememberStart(),
      bottomAxis = HorizontalAxis.rememberBottom(valueFormatter = periodLabels),
    )
  CartesianChartHost(chart, model, Modifier.fillMaxWidth().height(220.dp))
}
