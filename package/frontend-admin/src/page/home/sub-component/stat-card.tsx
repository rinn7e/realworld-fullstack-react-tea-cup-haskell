import { cn } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as S from 'fp-ts/lib/string'
import React, { memo } from 'react'

export type StatCardProps = {
  label: string
  value: string
  color: string
}

const StatCardPropsEq: EqClass.Eq<StatCardProps> = EqClass.struct({
  label: S.Eq,
  value: S.Eq,
  color: S.Eq,
})

const StatCardComponent = ({ label, value, color }: StatCardProps) => (
  <div className='dark:bg-surface-dark rounded-[12px] bg-white p-[24px] shadow-sm transition-transform hover:scale-[1.02]'>
    <div className='pb-[12px]'>
      <div className={cn('h-[4px] w-[40px] rounded-full', color)} />
    </div>
    <div className='text-slate-500 dark:text-slate-200'>{label}</div>
    <div className='text-[32px] font-bold text-slate-800 dark:text-white'>
      {value}
    </div>
  </div>
)

export const StatCardMemo = memo(StatCardComponent, StatCardPropsEq.equals)
