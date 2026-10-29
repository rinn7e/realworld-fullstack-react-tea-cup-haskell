import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { memo } from 'react'
import { type Dispatcher } from 'tea-cup-fp'

import { type Visitor, type VisitorSortAttr } from '@core/common/api'
import type * as SearchBar from '@core/component/search-bar'
import { type Model, type Msg } from '@core/screen/visitor-screen'

import { formatDateTime } from '@/common/util'
import { DetailPanelMemo } from '@/component/detail-panel/component'
import { ListViewMemo } from '@/component/list-view/component'
import { type Column } from '@/component/table/component'

const sortOptions: SearchBar.SearchOption<VisitorSortAttr>[] = [
  { label: 'Timestamp', value: 'timestamp' },
  { label: 'Path', value: 'path' },
  { label: 'IP', value: 'ip' },
]

const columns: Column<Visitor>[] = [
  { label: 'ID', width: 6, value: (v) => String(v.id) },
  { label: 'IP', width: 16, value: (v) => v.ip },
  { label: 'Path', width: 28, value: (v) => v.path },
  { label: 'User', width: 14, value: (v) => v.user?.username ?? '' },
  { label: 'Time', width: 16, value: (v) => formatDateTime(v.timestamp) },
]

export type VisitorScreenProps = {
  model: Model
  isTyping: boolean
  dispatch: Dispatcher<Msg>
  onTyping: (isTyping: boolean) => void
}

const VisitorScreenComponent = ({
  model,
  isTyping,
  dispatch,
  onTyping,
}: VisitorScreenProps) => (
  <ListViewMemo
    entityLabel='visitors'
    columns={columns}
    sortOptions={sortOptions}
    placeholder='IP, or a path starting with /'
    pagination={model.pagination}
    searchBar={model.searchBar}
    isTyping={isTyping}
    detail={pipe(
      model.selectedVisitor,
      O.fold(
        () => null,
        (v) => (
          <DetailPanelMemo
            title={`Visit ${v.id}`}
            rows={[
              ['IP', v.ip],
              ['Path', v.path],
              ['User', v.user?.username ?? 'anonymous'],
              ['User agent', v.userAgent],
              ['Fingerprint', v.fingerprint],
              ['Time', formatDateTime(v.timestamp)],
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
          msg: { _tag: 'SelectVisitor', visitor: O.some(item) },
        },
      })
    }
    onClose={() => dispatch({ _tag: 'ClearSelected' })}
    onPage={(page) =>
      dispatch({ _tag: 'PaginationMsg', subMsg: { _tag: 'ChangePage', page } })
    }
  />
)

export const VisitorScreenMemo = memo(VisitorScreenComponent)
