package component.paginationnav

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowLeft
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowRight
import androidx.compose.material.icons.filled.Check
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import teacup.Dispatcher

/**
 * The page controls under a list: previous, a menu of the pages (the same items
 * as the page buttons of the web app) and next.
 */
@Composable
fun PaginationNav(currentPage: Int, pageAmount: Int, onPageChange: Dispatcher<Int>) {
  if (pageAmount <= 1) return
  // Whether the menu is open is the state of the menu, not of the app
  var isMenuOpen by remember { mutableStateOf(false) }
  Surface(tonalElevation = 3.dp) {
    Row(Modifier.fillMaxWidth().padding(horizontal = 8.dp, vertical = 4.dp), verticalAlignment = Alignment.CenterVertically) {
      IconButton(onClick = { onPageChange(currentPage - 1) }, enabled = currentPage > 1) {
        Icon(Icons.AutoMirrored.Filled.KeyboardArrowLeft, contentDescription = "Previous page")
      }
      Box(Modifier.weight(1f), contentAlignment = Alignment.Center) {
        TextButton(onClick = { isMenuOpen = true }) { Text("Page $currentPage of $pageAmount") }
        DropdownMenu(expanded = isMenuOpen, onDismissRequest = { isMenuOpen = false }) {
          for (item in getPaginationPageItems(currentPage, pageAmount)) {
            when (item) {
              is PageItem.Page ->
                DropdownMenuItem(
                  text = { Text("Page ${item.page}") },
                  onClick = {
                    isMenuOpen = false
                    onPageChange(item.page)
                  },
                  trailingIcon = { if (item.page == currentPage) Icon(Icons.Filled.Check, contentDescription = null) },
                )
              is PageItem.Ellipsis -> HorizontalDivider()
            }
          }
        }
      }
      IconButton(onClick = { onPageChange(currentPage + 1) }, enabled = currentPage < pageAmount) {
        Icon(Icons.AutoMirrored.Filled.KeyboardArrowRight, contentDescription = "Next page")
      }
    }
  }
}
