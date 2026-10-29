package screen.visitorscreen

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.outlined.Info
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import common.api.type.VisitorSortAttr
import common.type.Shared
import component.pagedlist.PagedList
import component.searchbar.Option
import component.searchbar.SearchField
import component.searchbar.SortMenu
import screen.visitorscreen.subcomponent.VisitorDetailSheet
import screen.visitorscreen.subcomponent.VisitorRow
import teacup.Dispatcher
import teacuppagination.Msg as PaginationMsg

private val sortOptions =
  listOf(
    Option("Timestamp", VisitorSortAttr.Timestamp),
    Option("Path", VisitorSortAttr.Path),
    Option("IP", VisitorSortAttr.Ip),
    Option("ID", VisitorSortAttr.Id),
  )

private val description = buildAnnotatedString {
  append("Each entry here represents a ")
  withStyle(SpanStyle(fontWeight = FontWeight.Bold)) { append("unique device") }
  append(
    " that has visited the website, not an individual page hit. Uniqueness is determined by a SHA-256 fingerprint " +
      "derived from the visitor's IP address, browser User-Agent, and Accept-Language header. Revisiting the site " +
      "updates the existing record's last-seen path and timestamp rather than creating a new one.",
  )
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun VisitorScreen(model: Model, shared: Shared, dispatch: Dispatcher<Msg>, accountButton: @Composable () -> Unit) {
  val searchBarDispatch = dispatch.map(Msg::SearchBarMsg)
  Scaffold(
    topBar = {
      TopAppBar(
        title = { Text("Visitors") },
        actions = {
          IconButton(onClick = { dispatch(Msg.ToggleDescription) }) {
            Icon(
              if (model.isDescriptionOpen) Icons.Filled.Info else Icons.Outlined.Info,
              contentDescription = if (model.isDescriptionOpen) "Hide description" else "Show description",
            )
          }
          SortMenu(model.searchBar, sortOptions, searchBarDispatch)
          accountButton()
        },
      )
    },
  ) { padding ->
    Column(Modifier.padding(padding)) {
      SearchField(model.searchBar, "IP, or a path starting with /", searchBarDispatch)
      // Above the list, not a row of it: a row put in at the top while the list
      // shows its first row would be scrolled out of sight
      AnimatedVisibility(model.isDescriptionOpen) {
        Surface(color = MaterialTheme.colorScheme.surfaceVariant) {
          Text(description, style = MaterialTheme.typography.bodySmall, modifier = Modifier.padding(16.dp))
        }
      }
      PagedList(
        items = model.pagination.items,
        page = model.pagination.page,
        pageAmount = model.pagination.pageAmount,
        entityLabel = "visitors",
        onPageChange = dispatch.map { Msg.PaginationMsg(PaginationMsg.ChangePage(it)) },
        itemKey = { it.id },
      ) { visitor ->
        VisitorRow(visitor, onClick = { dispatch(Msg.PaginationMsg(PaginationMsg.ItemMsg(ItemMsg.SelectVisitor(visitor), visitor))) })
      }
    }
  }
  model.selectedVisitor?.let { visitor -> VisitorDetailSheet(visitor, dispatch) }
}
