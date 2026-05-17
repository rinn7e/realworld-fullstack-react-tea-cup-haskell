import * as O from 'fp-ts/lib/Option'
import React from 'react'

import { memoStrategy } from '@/common/util'
import { SearchBar, type SearchOption } from '@/component/search-bar'

import { UserDetailOverlay } from './sub-component/user-detail-overlay'
import { type Props, PropsEq } from './type'

const sortOptions: SearchOption[] = [
  { label: 'Username', value: 'username' },
  { label: 'Email', value: 'email' },
  { label: 'ID', value: 'id' },
]

export const UsersComponent: React.FC<Props> = ({ model, dispatch }) => {
  return (
    <div className='relative flex flex-col gap-[32px]'>
      <div className='flex flex-col gap-[24px]'>
        <h2 className='text-theme-secondary text-[28px] font-bold dark:text-white'>
          Users
        </h2>
        <SearchBar
          searchText={model.searchText}
          sort={model.sort}
          sortOptions={sortOptions}
          onSearchChange={(text) =>
            dispatch({ _tag: 'ChangeSearchText', text })
          }
          onSortChange={(sort) => dispatch({ _tag: 'ChangeSort', sort })}
          placeholder='Search users by username, email, or bio...'
        />
      </div>

      <div className='dark:bg-surface-dark overflow-x-auto rounded-[12px] bg-white shadow-sm'>
        <table className='w-full text-left'>
          <thead className='bg-slate-50 text-[12px] font-semibold tracking-wider text-slate-500 uppercase dark:bg-black/20 dark:text-slate-200'>
            <tr>
              <th className='px-[24px] py-[16px]'>ID</th>
              <th className='px-[24px] py-[16px]'>Avatar</th>
              <th className='px-[24px] py-[16px]'>Username</th>
              <th className='px-[24px] py-[16px]'>Email</th>
              <th className='px-[24px] py-[16px]'>Bio</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-slate-100 text-[14px] dark:divide-white/20'>
            {model.users.map((u) => (
              <tr
                key={u.id}
                className='cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-white/5'
                onClick={() =>
                  dispatch({ _tag: 'SelectUser', user: O.some(u) })
                }
              >
                <td className='px-[24px] py-[16px] font-mono text-slate-400 dark:text-slate-200'>
                  {u.id}
                </td>
                <td className='px-[24px] py-[16px]'>
                  <img
                    src={u.image || ''}
                    className='h-[32px] w-[32px] rounded-full object-cover shadow-sm'
                    alt=''
                  />
                </td>
                <td className='px-[24px] py-[16px] font-medium text-slate-800 dark:text-white'>
                  {u.username}
                </td>
                <td className='px-[24px] py-[16px] text-slate-600 dark:text-slate-200'>
                  {u.email}
                </td>
                <td className='max-w-[300px] truncate px-[24px] py-[16px] text-slate-400 dark:text-slate-200'>
                  {u.bio}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UserDetailOverlay
        selectedUser={model.selectedUser}
        dispatch={dispatch}
      />
    </div>
  )
}

export const UsersMemo = memoStrategy(UsersComponent, PropsEq.equals)
