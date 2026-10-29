import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { memo } from 'react'
import { type Dispatcher } from 'tea-cup-fp'

import { type Comment, type CommentSortAttr } from '@core/common/api'
import type * as SearchBar from '@core/component/search-bar'
import { type Model, type Msg } from '@core/screen/comment-screen'

import { formatDateTime } from '@/common/util'
import { DetailPanelMemo } from '@/component/detail-panel/component'
import { ListViewMemo } from '@/component/list-view/component'
import { type Column } from '@/component/table/component'

const sortOptions: SearchBar.SearchOption<CommentSortAttr>[] = [
  { label: 'Creation Date', value: 'createdAt' },
  { label: 'Author', value: 'author' },
  { label: 'ID', value: 'id' },
]

const columns: Column<Comment>[] = [
  { label: 'ID', width: 6, value: (c) => String(c.id) },
  { label: 'Author', width: 16, value: (c) => c.author.username },
  { label: 'Article', width: 24, value: (c) => c.articleSlug },
  { label: 'Comment', width: 30, value: (c) => c.body.replace(/\s+/g, ' ') },
  { label: 'Created', width: 16, value: (c) => formatDateTime(c.createdAt) },
]

export type CommentScreenProps = {
  model: Model
  isTyping: boolean
  dispatch: Dispatcher<Msg>
  onTyping: (isTyping: boolean) => void
}

const CommentScreenComponent = ({
  model,
  isTyping,
  dispatch,
  onTyping,
}: CommentScreenProps) => (
  <ListViewMemo
    entityLabel='comments'
    columns={columns}
    sortOptions={sortOptions}
    placeholder='author: or article: or text'
    pagination={model.pagination}
    searchBar={model.searchBar}
    isTyping={isTyping}
    detail={pipe(
      model.selectedComment,
      O.fold(
        () => null,
        (c) => (
          <DetailPanelMemo
            title={`Comment ${c.id}`}
            rows={[
              ['Author', c.author.username],
              ['Article', c.articleSlug],
              ['Comment', c.body],
              ['Created', formatDateTime(c.createdAt)],
              ['Updated', formatDateTime(c.updatedAt)],
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
          msg: { _tag: 'SelectComment', comment: O.some(item) },
        },
      })
    }
    onClose={() => dispatch({ _tag: 'ClearSelected' })}
    onPage={(page) =>
      dispatch({ _tag: 'PaginationMsg', subMsg: { _tag: 'ChangePage', page } })
    }
  />
)

export const CommentScreenMemo = memo(CommentScreenComponent)
