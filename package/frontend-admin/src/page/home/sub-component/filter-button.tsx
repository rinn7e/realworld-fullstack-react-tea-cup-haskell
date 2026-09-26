import { EqAlways } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as B from 'fp-ts/lib/boolean'
import * as S from 'fp-ts/lib/string'
import React, { memo } from 'react'

export type FilterButtonProps = {
  label: string
  active: boolean
  onClick: () => void
}

const FilterButtonPropsEq: EqClass.Eq<FilterButtonProps> = EqClass.struct({
  label: S.Eq,
  active: B.Eq,
  onClick: EqAlways,
})

const FilterButtonComponent = ({
  label,
  active,
  onClick,
}: FilterButtonProps) => (
  <button
    type='button'
    onClick={onClick}
    className={`rounded-[6px] px-[12px] py-[6px] text-[13px] font-medium transition-all ${
      active
        ? 'dark:bg-surface-dark text-theme-primary bg-white shadow-sm'
        : 'text-slate-500 hover:text-slate-700 dark:text-slate-200 dark:hover:text-slate-200'
    }`}
  >
    {label}
  </button>
)

export const FilterButtonMemo = memo(
  FilterButtonComponent,
  FilterButtonPropsEq.equals,
)
