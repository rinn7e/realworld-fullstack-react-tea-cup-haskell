package screen.articlescreen

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import common.api.type.ArticleSortAttr
import common.type.Shared
import component.pagedlist.PagedList
import component.searchbar.Option
import component.searchbar.SearchField
import component.searchbar.SortMenu
import screen.articlescreen.subcomponent.ArticleDetailSheet
import screen.articlescreen.subcomponent.ArticleRow
import teacup.Dispatcher
import teacuppagination.Msg as PaginationMsg

private val sortOptions =
  listOf(
    Option("Creation Date", ArticleSortAttr.CreatedAt),
    Option("Favorites", ArticleSortAttr.FavoritesCount),
    Option("Title", ArticleSortAttr.Title),
    Option("ID", ArticleSortAttr.Id),
  )

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ArticleScreen(model: Model, shared: Shared, dispatch: Dispatcher<Msg>, accountButton: @Composable () -> Unit) {
  val searchBarDispatch = dispatch.map(Msg::SearchBarMsg)
  Scaffold(
    topBar = {
      TopAppBar(
        title = { Text("Articles") },
        actions = {
          SortMenu(model.searchBar, sortOptions, searchBarDispatch)
          accountButton()
        },
      )
    },
  ) { padding ->
    Column(Modifier.padding(padding)) {
      SearchField(model.searchBar, "Title, slug or content", searchBarDispatch)
      PagedList(
        items = model.pagination.items,
        page = model.pagination.page,
        pageAmount = model.pagination.pageAmount,
        entityLabel = "articles",
        onPageChange = dispatch.map { Msg.PaginationMsg(PaginationMsg.ChangePage(it)) },
        itemKey = { it.id },
      ) { article ->
        ArticleRow(article, onClick = { dispatch(Msg.PaginationMsg(PaginationMsg.ItemMsg(ItemMsg.SelectArticle(article), article))) })
      }
    }
  }
  model.selectedArticle?.let { article -> ArticleDetailSheet(article, dispatch) }
}
