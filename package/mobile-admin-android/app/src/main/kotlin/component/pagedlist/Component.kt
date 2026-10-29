package component.pagedlist

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.HorizontalDivider
import androidx.compose.runtime.Composable
import androidx.compose.runtime.key
import androidx.compose.ui.Modifier
import common.api.type.HttpError
import component.liststate.ListStateEmpty
import component.liststate.ListStateFailure
import component.liststate.ListStateLoading
import component.paginationnav.PaginationNav
import teacup.Dispatcher
import teacup.RemoteData

/**
 * The items of a paged list, with the list states and the page controls under
 * it: the `PaginationMemo` of the web app with the `renderItems` and
 * `renderPagination` every screen gives it. The list starts at the top again on
 * every page (`key(page)` makes its scroll state afresh), like
 * `scrollToTopCmd` of the package.
 */
@Composable
fun <Item> PagedList(
  items: RemoteData<HttpError, List<Item>>,
  page: Int,
  pageAmount: Int,
  entityLabel: String,
  onPageChange: Dispatcher<Int>,
  itemKey: (Item) -> Any,
  modifier: Modifier = Modifier,
  row: @Composable (Item) -> Unit,
) {
  Column(modifier.fillMaxSize()) {
    key(page) {
      LazyColumn(Modifier.weight(1f)) {
        when (items) {
          RemoteData.Initial, RemoteData.Pending -> item { ListStateLoading() }
          is RemoteData.Failure -> item { ListStateFailure(entityLabel, items.error) }
          is RemoteData.Success ->
            if (items.value.isEmpty()) {
              item { ListStateEmpty(entityLabel) }
            } else {
              items(items.value, key = itemKey) { item ->
                row(item)
                HorizontalDivider()
              }
            }
        }
      }
    }
    PaginationNav(currentPage = page, pageAmount = pageAmount, onPageChange = onPageChange)
  }
}
