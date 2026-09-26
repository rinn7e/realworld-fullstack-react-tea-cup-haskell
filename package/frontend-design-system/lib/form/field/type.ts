import { UndefinableEq } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as boolean from 'fp-ts/lib/boolean'
import * as string from 'fp-ts/lib/string'
import type React from 'react'

export type FieldProps = {
  label?: string
  helpText?: string
  errorText?: string
  isExpanded?: boolean
  children?: React.ReactNode
  className?: string
  dataTest?: string
}

export const FieldPropsEq: EqClass.Eq<FieldProps> = EqClass.struct<FieldProps>({
  label: UndefinableEq(string.Eq),
  helpText: UndefinableEq(string.Eq),
  errorText: UndefinableEq(string.Eq),
  isExpanded: UndefinableEq(boolean.Eq),
  children: EqClass.eqStrict,
  className: UndefinableEq(string.Eq),
  dataTest: UndefinableEq(string.Eq),
})
