package screen.visitorscreen.subcomponent

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.outlined.Lan
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material3.Icon
import androidx.compose.material3.ListItem
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import common.api.type.Visitor
import common.type.formatDateTime

@Composable
fun VisitorRow(visitor: Visitor, onClick: () -> Unit) {
  ListItem(
    modifier = Modifier.clickable(onClick = onClick),
    headlineContent = {
      Row(verticalAlignment = Alignment.CenterVertically) {
        Text(visitor.path, fontFamily = FontFamily.Monospace, maxLines = 1, overflow = TextOverflow.Ellipsis, modifier = Modifier.weight(1f))
        Text(formatDateTime(visitor.timestamp), style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
      }
    },
    supportingContent = {
      Column {
        Row(horizontalArrangement = Arrangement.spacedBy(4.dp), verticalAlignment = Alignment.CenterVertically) {
          Icon(Icons.Outlined.Lan, contentDescription = null, Modifier.size(14.dp))
          Text(visitor.ip, style = MaterialTheme.typography.bodySmall)
          Spacer(Modifier.size(8.dp))
          val user = visitor.user
          Icon(if (user != null) Icons.Filled.Person else Icons.Outlined.Person, contentDescription = null, Modifier.size(14.dp))
          Text(user?.username ?: "Anonymous", style = MaterialTheme.typography.bodySmall)
        }
        Text(visitor.userAgent, style = MaterialTheme.typography.labelSmall, maxLines = 1, overflow = TextOverflow.Ellipsis)
      }
    },
  )
}
