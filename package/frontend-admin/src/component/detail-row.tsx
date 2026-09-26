import { cn } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as B from 'fp-ts/lib/boolean'
import * as S from 'fp-ts/lib/string'
import { memo } from 'react'

export type DetailRowProps = {
  label: string
  value: string
  isMono: boolean
}

const DetailRowPropsEq: EqClass.Eq<DetailRowProps> = EqClass.struct({
  label: S.Eq,
  value: S.Eq,
  isMono: B.Eq,
})

const DetailRowComponent = ({ label, value, isMono }: DetailRowProps) => (
  <div className='flex min-w-0 flex-col gap-[4px] pb-[24px]'>
    <div className='text-[12px] font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-200'>
      {label}
    </div>
    <div
      className={cn(
        'text-theme-secondary text-[16px] break-words dark:text-white',
        isMono && 'font-mono',
      )}
    >
      {value}
    </div>
  </div>
)

export const DetailRowMemo = memo(DetailRowComponent, DetailRowPropsEq.equals)
