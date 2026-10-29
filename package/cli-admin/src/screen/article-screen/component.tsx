import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { memo } from 'react'
import { type Dispatcher } from 'tea-cup-fp'

import { type Article, type ArticleSortAttr } from '@/common/api'
import { formatDateTime } from '@/common/util'
import { DetailPanelMemo } from '@/component/detail-panel/component'
import { ListViewMemo } from '@/component/list-view/component'
import type * as SearchBar from '@/component/search-bar'
import { type Column } from '@/component/table/component'
import { type Model, type Msg } from '@/screen/article-screen'

const sortOptions: SearchBar.SearchOption<ArticleSortAttr>[] = [
  { label: 'Creation Date', value: 'createdAt' },
  { label: 'Favorites', value: 'favoritesCount' },
  { label: 'Title', value: 'title' },
  { label: 'ID', value: 'id' },
]

const columns: Column<Article>[] = [
  { label: 'ID', width: 6, value: (a) => String(a.id) },
  { label: 'Title', width: 36, value: (a) => a.title },
  { label: 'Author', width: 16, value: (a) => a.author.username },
  { label: 'Favs', width: 5, value: (a) => String(a.favoritesCount) },
  { label: 'Created', width: 16, value: (a) => formatDateTime(a.createdAt) },
]

export type ArticleScreenProps = {
  model: Model
  isTyping: boolean
  dispatch: Dispatcher<Msg>
  onTyping: (isTyping: boolean) => void
}

const ArticleScreenComponent = ({
  model,
  isTyping,
  dispatch,
  onTyping,
}: ArticleScreenProps) => (
  <ListViewMemo
    entityLabel='articles'
    columns={columns}
    sortOptions={sortOptions}
    placeholder='title, slug, or content'
    pagination={model.pagination}
    searchBar={model.searchBar}
    isTyping={isTyping}
    detail={pipe(
      model.selectedArticle,
      O.fold(
        () => null,
        (a) => (
          <DetailPanelMemo
            title={a.title}
            rows={[
              ['ID', String(a.id)],
              ['Slug', a.slug],
              ['Author', a.author.username],
              ['Description', a.description],
              ['Tags', a.tagList.join(', ')],
              ['Favorites', String(a.favoritesCount)],
              ['Created', formatDateTime(a.createdAt)],
              ['Updated', formatDateTime(a.updatedAt)],
            ]}
          />
        ),
      ),
    )}
    searchDispatch={(subMsg) => dispatch({ _tag: 'SearchBarMsg', subMsg })}
    onTyping={onTyping}
    onSelect={(item) =>
      dispatch({
        _tag: 'PaginationMsg',
        subMsg: {
          _tag: 'ItemMsg',
          item,
          msg: { _tag: 'SelectArticle', article: O.some(item) },
        },
      })
    }
    onClose={() => dispatch({ _tag: 'ClearSelected' })}
    onPage={(page) =>
      dispatch({ _tag: 'PaginationMsg', subMsg: { _tag: 'ChangePage', page } })
    }
  />
)

export const ArticleScreenMemo = memo(ArticleScreenComponent)
