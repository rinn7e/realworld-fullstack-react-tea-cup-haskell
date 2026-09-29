import { PaginationMemo } from '@rinn7e/tea-cup-pagination/component'
import React, { memo } from 'react'

import {
  AdminUserEq,
  ApiErrorEq,
  type UserSortAttr,
  getHttpErrorEq,
} from '@/common/api'
import type * as SearchBar from '@/component/search-bar'
import { SearchBarMemo } from '@/component/search-bar/component'

import { UserDetailOverlayMemo } from './sub-component/user-detail-overlay'
import { type Props, PropsEq } from './type'
import { mkPaginationConfig } from './util'

const sortOptions: SearchBar.SearchOption<UserSortAttr>[] = [
  { label: 'Username', value: 'username' },
  { label: 'Email', value: 'email' },
  { label: 'ID', value: 'id' },
]

const UserPageComponent = ({ model, shared, dispatch }: Props) => {
  const paginationConfig = mkPaginationConfig(shared, model)

  return (
    <div className='relative flex flex-col gap-[32px]'>
      <div className='flex flex-col gap-[24px]'>
        <h2 className='text-theme-secondary text-[28px] font-bold dark:text-white'>
          Users
        </h2>
        <SearchBarMemo<UserSortAttr>
          model={model.searchBar}
          sortOptions={sortOptions}
          sortToString={(s) => s}
          dispatch={(subMsg: SearchBar.Msg<UserSortAttr>) =>
            dispatch({ _tag: 'SearchBarMsg', subMsg })
          }
          placeholder='Search users by username, email, or bio...'
        />
      </div>

      <div className='flex flex-col gap-[20px]'>
        <PaginationMemo
          model={model.pagination}
          dispatch={(subMsg) => dispatch({ _tag: 'PaginationMsg', subMsg })}
          config={paginationConfig}
          itemEq={AdminUserEq}
          errEq={getHttpErrorEq(ApiErrorEq)}
        />
      </div>

      <UserDetailOverlayMemo
        selectedUser={model.selectedUser}
        dispatch={dispatch}
      />
    </div>
  )
}

export const UserPageMemo = memo(UserPageComponent, PropsEq.equals)
