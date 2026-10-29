package screen.commentscreen

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import common.api.type.CommentSortAttr
import common.type.Shared
import component.pagedlist.PagedList
import component.searchbar.Option
import component.searchbar.SearchField
import component.searchbar.SortMenu
import screen.commentscreen.subcomponent.CommentDetailSheet
import screen.commentscreen.subcomponent.CommentRow
import teacup.Dispatcher
import teacuppagination.Msg as PaginationMsg

private val sortOptions =
  listOf(
    Option("Creation Date", CommentSortAttr.CreatedAt),
    Option("Author", CommentSortAttr.Author),
    Option("ID", CommentSortAttr.Id),
  )

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CommentScreen(model: Model, shared: Shared, dispatch: Dispatcher<Msg>, accountButton: @Composable () -> Unit) {
  val searchBarDispatch = dispatch.map(Msg::SearchBarMsg)
  Scaffold(
    topBar = {
      TopAppBar(
        title = { Text("Comments") },
        actions = {
          SortMenu(model.searchBar, sortOptions, searchBarDispatch)
          accountButton()
        },
      )
    },
  ) { padding ->
    Column(Modifier.padding(padding)) {
      SearchField(model.searchBar, "Author, @user, article:slug", searchBarDispatch)
      PagedList(
        items = model.pagination.items,
        page = model.pagination.page,
        pageAmount = model.pagination.pageAmount,
        entityLabel = "comments",
        onPageChange = dispatch.map { Msg.PaginationMsg(PaginationMsg.ChangePage(it)) },
        itemKey = { it.id },
      ) { comment ->
        CommentRow(comment, onClick = { dispatch(Msg.PaginationMsg(PaginationMsg.ItemMsg(ItemMsg.SelectComment(comment), comment))) })
      }
    }
  }
  model.selectedComment?.let { comment -> CommentDetailSheet(comment, dispatch) }
}
