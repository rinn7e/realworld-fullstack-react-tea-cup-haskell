import { EqAlways } from '@rinn7e/tea-cup-prelude'
import * as A from 'fp-ts/lib/Array'
import * as EqClass from 'fp-ts/lib/Eq'
import * as O from 'fp-ts/lib/Option'
import { memo } from 'react'

import { type AdminUser, AdminUserEq } from '@/common/api'
import { ProfileThumbnailMemo } from '@/component/profile-thumbnail'

import type { UserItemMsg } from '../type'

export type UserTableProps = {
  users: AdminUser[]
  itemDispatch: (item: AdminUser, msg: UserItemMsg) => void
}

const UserTablePropsEq: EqClass.Eq<UserTableProps> = EqClass.struct({
  users: A.getEq(AdminUserEq),
  itemDispatch: EqAlways,
})

const UserTableComponent = ({ users, itemDispatch }: UserTableProps) => (
  <div className='dark:bg-surface-dark overflow-x-auto rounded-[12px] border border-slate-100 bg-white shadow-sm dark:border-white/10'>
    <table className='w-full border-collapse text-left'>
      <thead className='bg-slate-50 text-[12px] font-semibold tracking-wider text-slate-500 uppercase dark:bg-black/20 dark:text-slate-200'>
        <tr>
          <th className='px-[24px] py-[16px]'>ID</th>
          <th className='px-[24px] py-[16px]'>Avatar</th>
          <th className='px-[24px] py-[16px]'>Username</th>
          <th className='px-[24px] py-[16px]'>Email</th>
          <th className='px-[24px] py-[16px]'>Bio</th>
          <th className='px-[24px] py-[16px]'>Role</th>
        </tr>
      </thead>
      <tbody className='divide-y divide-slate-100 text-[14px] dark:divide-white/10'>
        {users.map((u) => (
          <tr
            key={u.id}
            className='cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-white/5'
            onClick={() =>
              itemDispatch(u, {
                _tag: 'SelectUser',
                user: O.some(u),
              })
            }
          >
            <td className='px-[24px] py-[16px] font-mono text-slate-400 dark:text-slate-200'>
              {u.id}
            </td>
            <td className='px-[24px] py-[16px]'>
              <ProfileThumbnailMemo
                src={u.image}
                className='h-[32px] w-[32px] rounded-full object-cover shadow-sm'
              />
            </td>
            <td className='px-[24px] py-[16px] font-medium text-slate-800 dark:text-white'>
              {u.username}
            </td>
            <td className='px-[24px] py-[16px] text-slate-600 dark:text-slate-200'>
              {u.email}
            </td>
            <td className='max-w-[300px] truncate px-[24px] py-[16px] text-slate-400 dark:text-slate-200'>
              {u.bio || '—'}
            </td>
            <td className='px-[24px] py-[16px]'>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  u.role === 'admin'
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                    : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                }`}
              >
                {u.role}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export const UserTableMemo = memo(UserTableComponent, UserTablePropsEq.equals)
