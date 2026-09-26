import { UndefinableEq } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as boolean from 'fp-ts/lib/boolean'
import * as string from 'fp-ts/lib/string'
import type React from 'react'

export type CheckboxProps = {
  label?: React.ReactNode
  checked?: boolean
  isDisabled?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  name?: string
  id?: string
  className?: string
  dataTest?: string
}

export const CheckboxPropsEq: EqClass.Eq<CheckboxProps> =
  EqClass.struct<CheckboxProps>({
    label: EqClass.eqStrict,
    checked: UndefinableEq(boolean.Eq),
    isDisabled: UndefinableEq(boolean.Eq),
    onChange: EqClass.eqStrict,
    name: UndefinableEq(string.Eq),
    id: UndefinableEq(string.Eq),
    className: UndefinableEq(string.Eq),
    dataTest: UndefinableEq(string.Eq),
  })
