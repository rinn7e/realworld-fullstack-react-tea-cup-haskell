import * as boolean from 'fp-ts/boolean'
import * as EqClass from 'fp-ts/Eq'
import * as string from 'fp-ts/string'
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
  key?: React.Key
  dataTest?: string
}

export const SelectOptionEq: EqClass.Eq<SelectOption> = EqClass.struct({
  label: string.Eq,
  value: string.Eq,
})

export const SelectPropsEq: EqClass.Eq<SelectProps> = EqClass.struct<
  Required<SelectProps>
>({
  options: EqClass.eqStrict,
  value: string.Eq,
  isDisabled: boolean.Eq,
  isMultiple: boolean.Eq,
  onChange: EqClass.eqStrict,
  name: string.Eq,
  className: string.Eq,
  key: EqClass.eqStrict,
  dataTest: string.Eq,
}) as unknown as EqClass.Eq<SelectProps>
