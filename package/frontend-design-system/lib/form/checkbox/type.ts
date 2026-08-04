import * as EqClass from 'fp-ts/Eq'
import * as boolean from 'fp-ts/boolean'
import * as string from 'fp-ts/string'
import type React from 'react'

export type CheckboxProps = {
  label?: React.ReactNode
  checked?: boolean
  isDisabled?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  name?: string
  id?: string
  className?: string
  key?: React.Key
  dataTest?: string
}

export const CheckboxPropsEq: EqClass.Eq<CheckboxProps> = EqClass.struct<
  Required<CheckboxProps>
>({
  label: EqClass.eqStrict,
  checked: boolean.Eq,
  isDisabled: boolean.Eq,
  onChange: EqClass.eqStrict,
  name: string.Eq,
  id: string.Eq,
  className: string.Eq,
  key: EqClass.eqStrict,
  dataTest: string.Eq,
}) as unknown as EqClass.Eq<CheckboxProps>
