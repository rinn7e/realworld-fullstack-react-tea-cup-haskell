package component.detailrow

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.selection.SelectionContainer
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp

/** A label and its value in a detail sheet, the value selectable for copying */
@Composable
fun DetailRow(label: String, value: String, isMono: Boolean) {
  DetailRow(label) {
    SelectionContainer {
      Text(
        value,
        style = MaterialTheme.typography.bodyMedium,
        fontFamily = if (isMono) FontFamily.Monospace else null,
        textAlign = TextAlign.End,
      )
    }
  }
}

/** A label and any content on its right (a badge) */
@Composable
fun DetailRow(label: String, content: @Composable () -> Unit) {
  Row(
    Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 10.dp),
    horizontalArrangement = Arrangement.spacedBy(16.dp),
  ) {
    Text(label, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
    Row(Modifier.weight(1f), horizontalArrangement = Arrangement.End) { content() }
  }
}

/** The title of a group of rows in a sheet, like the header of a section */
@Composable
fun SectionHeader(title: String) {
  Text(
    title,
    style = MaterialTheme.typography.labelLarge,
    color = MaterialTheme.colorScheme.primary,
    modifier = Modifier.padding(start = 16.dp, end = 16.dp, top = 16.dp, bottom = 4.dp),
  )
}
