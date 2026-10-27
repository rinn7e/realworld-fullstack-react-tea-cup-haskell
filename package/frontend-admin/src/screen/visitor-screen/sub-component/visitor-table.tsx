import { EqAlways } from '@rinn7e/tea-cup-prelude'
import * as A from 'fp-ts/lib/Array'
import * as EqClass from 'fp-ts/lib/Eq'
import * as O from 'fp-ts/lib/Option'
import { memo } from 'react'

import { type Visitor, VisitorEq } from '@/common/api'

import type { VisitorItemMsg } from '../type'

export type VisitorTableProps = {
  visitors: Visitor[]
  itemDispatch: (item: Visitor, msg: VisitorItemMsg) => void
}

const VisitorTablePropsEq: EqClass.Eq<VisitorTableProps> = EqClass.struct({
  visitors: A.getEq(VisitorEq),
  itemDispatch: EqAlways,
})

const VisitorTableComponent = ({
  visitors,
  itemDispatch,
}: VisitorTableProps) => (
  <div className='dark:bg-surface-dark overflow-x-auto rounded-[12px] border border-slate-100 bg-white shadow-sm dark:border-white/10'>
    <table className='w-full border-collapse text-left'>
      <thead className='bg-slate-50 text-[12px] font-semibold tracking-wider text-slate-500 uppercase dark:bg-black/20 dark:text-slate-200'>
        <tr>
          <th className='px-[24px] py-[16px]'>ID</th>
          <th className='px-[24px] py-[16px]'>User</th>
          <th className='px-[24px] py-[16px]'>IP Address</th>
          <th className='px-[24px] py-[16px]'>Fingerprint</th>
          <th className='px-[24px] py-[16px]'>Path</th>
          <th className='px-[24px] py-[16px]'>User Agent</th>
          <th className='px-[24px] py-[16px]'>Visited At</th>
        </tr>
      </thead>
      <tbody className='divide-y divide-slate-100 text-[14px] dark:divide-white/10'>
        {visitors.map((v) => (
          <tr
            key={v.id}
            className='cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-white/5'
            onClick={() =>
              itemDispatch(v, {
                _tag: 'SelectVisitor',
                visitor: O.some(v),
              })
            }
          >
            <td className='px-[24px] py-[16px] font-mono text-slate-400 dark:text-slate-200'>
              {v.id}
            </td>
            <td className='px-[24px] py-[16px] font-medium text-slate-600 dark:text-slate-200'>
              {v.user ? (
                <span className='text-theme-primary font-semibold'>
                  @{v.user.username}
                </span>
              ) : (
                <span className='text-slate-400 italic'>Anonymous</span>
              )}
            </td>
            <td className='text-theme-secondary px-[24px] py-[16px] font-medium dark:text-white'>
              {v.ip}
            </td>
            <td
              className='px-[24px] py-[16px] font-mono text-[13px] text-slate-500 dark:text-slate-200'
              title={v.fingerprint}
            >
              {v.fingerprint ? `${v.fingerprint.substring(0, 8)}...` : '-'}
            </td>
            <td className='px-[24px] py-[16px] font-mono text-[12px] text-slate-500 dark:text-slate-200'>
              {v.path}
            </td>
            <td className='max-w-[300px] truncate px-[24px] py-[16px] text-slate-600 dark:text-slate-200'>
              {v.userAgent}
            </td>
            <td className='px-[24px] py-[16px] text-slate-400 dark:text-slate-200'>
              {v.timestamp.toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export const VisitorTableMemo = memo(
  VisitorTableComponent,
  VisitorTablePropsEq.equals,
)
