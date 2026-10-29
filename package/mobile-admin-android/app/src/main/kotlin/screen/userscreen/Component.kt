package screen.userscreen

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import common.api.type.UserSortAttr
import common.type.Shared
import component.pagedlist.PagedList
import component.searchbar.Option
import component.searchbar.SearchField
import component.searchbar.SortMenu
import screen.userscreen.subcomponent.UserDetailSheet
import screen.userscreen.subcomponent.UserRow
import teacup.Dispatcher
import teacuppagination.Msg as PaginationMsg

private val sortOptions =
  listOf(
    Option("Username", UserSortAttr.Username),
    Option("Email", UserSortAttr.Email),
    Option("ID", UserSortAttr.Id),
  )

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun UserScreen(model: Model, shared: Shared, dispatch: Dispatcher<Msg>, accountButton: @Composable () -> Unit) {
  val searchBarDispatch = dispatch.map(Msg::SearchBarMsg)
  Scaffold(
    topBar = {
      TopAppBar(
        title = { Text("Users") },
        actions = {
          SortMenu(model.searchBar, sortOptions, searchBarDispatch)
          accountButton()
        },
      )
    },
  ) { padding ->
    Column(Modifier.padding(padding)) {
      SearchField(model.searchBar, "Username, @user, email:…", searchBarDispatch)
      PagedList(
        items = model.pagination.items,
        page = model.pagination.page,
        pageAmount = model.pagination.pageAmount,
        entityLabel = "users",
        onPageChange = dispatch.map { Msg.PaginationMsg(PaginationMsg.ChangePage(it)) },
        itemKey = { it.id },
      ) { user ->
        UserRow(user, onClick = { dispatch(Msg.PaginationMsg(PaginationMsg.ItemMsg(ItemMsg.SelectUser(user), user))) })
      }
    }
  }
  model.selectedUser?.let { user -> UserDetailSheet(user, dispatch) }
}
