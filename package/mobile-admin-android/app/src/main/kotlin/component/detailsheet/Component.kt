package component.detailsheet

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

/**
 * The detail of an item as a bottom sheet, the slide-over panel of the web app.
 * Shown while the screen model holds a selected item; closing it (Done, a swipe
 * down, back) sends `onDone`, which clears the selection.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DetailSheet(title: String, onDone: () -> Unit, titleExtra: @Composable () -> Unit = {}, content: @Composable ColumnScope.() -> Unit) {
  ModalBottomSheet(onDismissRequest = onDone) {
    Row(Modifier.fillMaxWidth().padding(start = 16.dp, end = 8.dp), verticalAlignment = Alignment.CenterVertically) {
      Text(title, style = MaterialTheme.typography.titleLarge)
      Spacer(Modifier.padding(4.dp))
      titleExtra()
      Spacer(Modifier.weight(1f))
      TextButton(onClick = onDone) { Text("Done") }
    }
    Column(Modifier.verticalScroll(rememberScrollState())) {
      content()
      Spacer(Modifier.height(24.dp))
    }
  }
}
