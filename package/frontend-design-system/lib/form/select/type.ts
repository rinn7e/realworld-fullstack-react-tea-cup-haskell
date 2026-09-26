import { UndefinableEq } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as boolean from 'fp-ts/lib/boolean'
import * as string from 'fp-ts/lib/string'
import type React from 'react'

export type SelectOption = {
  label: string
  value: string
}

export type SelectProps = {
  options: SelectOption[]
  value?: string
  isDisabled?: boolean
  isMultiple?: boolean
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  name?: string
  className?: string
  dataTest?: string
}

export const SelectOptionEq: EqClass.Eq<SelectOption> = EqClass.struct({
  label: string.Eq,
  value: string.Eq,
})

export const SelectPropsEq: EqClass.Eq<SelectProps> =
  EqClass.struct<SelectProps>({
    options: EqClass.eqStrict,
    value: UndefinableEq(string.Eq),
    isDisabled: UndefinableEq(boolean.Eq),
    isMultiple: UndefinableEq(boolean.Eq),
    onChange: EqClass.eqStrict,
    name: UndefinableEq(string.Eq),
    className: UndefinableEq(string.Eq),
    dataTest: UndefinableEq(string.Eq),
  })
