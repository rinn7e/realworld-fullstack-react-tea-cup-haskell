package component.paginationnav

sealed interface PageItem {
  data class Page(val page: Int) : PageItem

  // Each ellipsis carries its place, so a list can tell the two apart
  data class Ellipsis(val place: Int) : PageItem
}

/**
 * Page buttons to show: every page when there are at most 7, otherwise the
 * first/last page, the pages around the current one and ellipses.
 */
fun getPaginationPageItems(currentPage: Int, pageAmount: Int): List<PageItem> =
  when {
    pageAmount <= 7 -> (1..pageAmount).map(PageItem::Page)
    currentPage <= 4 -> (1..5).map(PageItem::Page) + listOf(PageItem.Ellipsis(1), PageItem.Page(pageAmount))
    currentPage >= pageAmount - 3 ->
      listOf(PageItem.Page(1), PageItem.Ellipsis(1)) + (4 downTo 0).map { PageItem.Page(pageAmount - it) }
    else ->
      listOf(PageItem.Page(1), PageItem.Ellipsis(1)) +
        (currentPage - 1..currentPage + 1).map(PageItem::Page) +
        listOf(PageItem.Ellipsis(2), PageItem.Page(pageAmount))
  }
