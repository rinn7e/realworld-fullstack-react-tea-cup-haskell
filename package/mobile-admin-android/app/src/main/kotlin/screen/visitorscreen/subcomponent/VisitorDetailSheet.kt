package screen.visitorscreen.subcomponent

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.selection.SelectionContainer
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import common.api.type.Visitor
import common.type.formatDateTime
import component.detailrow.DetailRow
import component.detailrow.SectionHeader
import component.detailsheet.DetailSheet
import component.rolebadge.RoleBadge
import screen.visitorscreen.Msg
import teacup.Dispatcher

@Composable
fun VisitorDetailSheet(visitor: Visitor, dispatch: Dispatcher<Msg>) {
  DetailSheet("Visitor Details", onDone = { dispatch(Msg.ClearSelected) }) {
    Column(Modifier.padding(16.dp)) {
      Text("Visitor #${visitor.id}", style = MaterialTheme.typography.titleLarge)
      Text(formatDateTime(visitor.timestamp), color = MaterialTheme.colorScheme.onSurfaceVariant)
    }
    DetailRow("IP Address", visitor.ip, isMono = true)
    DetailRow("Path", visitor.path, isMono = true)
    SectionHeader("Device")
    Column(Modifier.padding(horizontal = 16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
      Text("Fingerprint", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
      SelectionContainer { Text(visitor.fingerprint, style = MaterialTheme.typography.bodySmall, fontFamily = FontFamily.Monospace) }
      FingerprintBreakdown(visitor.ip, visitor.userAgent)
      Text(
        "Each unique combination of IP address, browser User-Agent, and Accept-Language header produces the same hash, " +
          "identifying the same device across visits without storing personal data.",
        style = MaterialTheme.typography.bodySmall,
        color = MaterialTheme.colorScheme.onSurfaceVariant,
      )
    }
    val user = visitor.user
    if (user != null) {
      SectionHeader("Linked User")
      DetailRow("User ID", "#${user.id}", isMono = true)
      DetailRow("Username", "@${user.username}", isMono = false)
      DetailRow("Email", user.email, isMono = false)
      DetailRow("Role") { RoleBadge(user.role) }
    }
  }
}

/** How the fingerprint is calculated, with the inputs of this visitor */
@Composable
private fun FingerprintBreakdown(ip: String, userAgent: String) {
  Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
    Text("How is this calculated?", style = MaterialTheme.typography.labelMedium, fontWeight = FontWeight.Bold)
    Text("SHA-256( IP | User-Agent | Accept-Language )", style = MaterialTheme.typography.bodySmall, fontFamily = FontFamily.Monospace)
    TagLine("IP", ip, Color(0xFF2563EB))
    TagLine("UA", userAgent, Color(0xFF9333EA))
  }
}

@Composable
private fun TagLine(tag: String, value: String, color: Color) {
  Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.Top) {
    Text(
      tag,
      style = MaterialTheme.typography.labelSmall,
      fontFamily = FontFamily.Monospace,
      fontWeight = FontWeight.Bold,
      color = color,
      modifier = Modifier.background(color.copy(alpha = 0.15f), RoundedCornerShape(4.dp)).padding(horizontal = 6.dp),
    )
    Text(value, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
  }
}
