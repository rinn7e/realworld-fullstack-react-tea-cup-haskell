import * as EqClass from 'fp-ts/Eq'
import * as boolean from 'fp-ts/boolean'
import * as string from 'fp-ts/string'
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

export const FieldPropsEq: EqClass.Eq<FieldProps> = EqClass.struct<
  Required<FieldProps>
>({
  label: string.Eq,
  helpText: string.Eq,
  errorText: string.Eq,
  isExpanded: boolean.Eq,
  children: EqClass.eqStrict,
  className: string.Eq,
  dataTest: string.Eq,
}) as unknown as EqClass.Eq<FieldProps>
