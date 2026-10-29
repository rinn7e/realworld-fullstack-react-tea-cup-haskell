package screen.homescreen.subcomponent

import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.selection.SelectionContainer
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import common.api.type.Log
import common.type.formatDateTime
import component.detailrow.DetailRow
import component.detailrow.SectionHeader
import component.detailsheet.DetailSheet
import screen.homescreen.Msg
import teacup.Dispatcher

/** The detail of a log, the slide-over panel of the web app as a sheet */
@Composable
fun LogDetailSheet(log: Log, dispatch: Dispatcher<Msg>) {
  DetailSheet("Log Detail", onDone = { dispatch(Msg.SelectLog(null)) }, titleExtra = { LevelBadge(log.level) }) {
    SectionHeader("Event Message")
    SelectionContainer {
      Text(log.message, style = MaterialTheme.typography.bodyMedium, fontFamily = FontFamily.Monospace, modifier = Modifier.padding(horizontal = 16.dp))
    }
    SectionHeader("Details")
    DetailRow("Level", log.level.name, isMono = false)
    DetailRow("Source", log.source, isMono = true)
    DetailRow("Occurrence Time", formatDateTime(log.timestamp), isMono = false)
    SectionHeader("Context Metadata")
    DetailRow("Node ID", "node-ap-southeast-1a", isMono = true)
    DetailRow("Environment") { Text("Production", color = Color(0xFF16A34A), fontWeight = FontWeight.Bold) }
  }
}
