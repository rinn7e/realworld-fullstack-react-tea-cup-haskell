import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { memo } from 'react'
import { type Dispatcher } from 'tea-cup-fp'

import { type AdminUser, type UserSortAttr } from '@core/common/api'
import type * as SearchBar from '@core/component/search-bar'
import { type Model, type Msg } from '@core/screen/user-screen'

import { DetailPanelMemo } from '@/component/detail-panel/component'
import { ListViewMemo } from '@/component/list-view/component'
import { type Column } from '@/component/table/component'

const sortOptions: SearchBar.SearchOption<UserSortAttr>[] = [
  { label: 'Username', value: 'username' },
  { label: 'Email', value: 'email' },
  { label: 'ID', value: 'id' },
]

const columns: Column<AdminUser>[] = [
  { label: 'ID', width: 6, value: (u) => String(u.id) },
  { label: 'Username', width: 20, value: (u) => u.username },
  { label: 'Email', width: 30, value: (u) => u.email },
  { label: 'Role', width: 12, value: (u) => u.role },
]

export type UserScreenProps = {
  model: Model
  isTyping: boolean
  dispatch: Dispatcher<Msg>
  onTyping: (isTyping: boolean) => void
}

const UserScreenComponent = ({
  model,
  isTyping,
  dispatch,
  onTyping,
}: UserScreenProps) => (
  <ListViewMemo
    entityLabel='users'
    columns={columns}
    sortOptions={sortOptions}
    placeholder='username, email, or @name'
    pagination={model.pagination}
    searchBar={model.searchBar}
    isTyping={isTyping}
    detail={pipe(
      model.selectedUser,
      O.fold(
        () => null,
        (u) => (
          <DetailPanelMemo
            title={u.username}
            rows={[
              ['ID', String(u.id)],
              ['Username', u.username],
              ['Email', u.email],
              ['Role', u.role],
              ['Bio', u.bio ?? ''],
              ['Image', u.image ?? ''],
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
          msg: { _tag: 'SelectUser', user: O.some(item) },
        },
      })
    }
    onClose={() => dispatch({ _tag: 'ClearSelected' })}
    onPage={(page) =>
      dispatch({ _tag: 'PaginationMsg', subMsg: { _tag: 'ChangePage', page } })
    }
  />
)

export const UserScreenMemo = memo(UserScreenComponent)
