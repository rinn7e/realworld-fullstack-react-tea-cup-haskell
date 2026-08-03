import * as boolean from 'fp-ts/boolean'
import * as EqClass from 'fp-ts/Eq'
import * as string from 'fp-ts/string'
import type React from 'react'

export type RadioOption = {
  label: React.ReactNode
  value: string
}

export type RadioProps = {
  name: string
  options: RadioOption[]
  selectedValue?: string
  isDisabled?: boolean
  onChange?: (value: string) => void
  className?: string
  key?: React.Key
  dataTest?: string
}

export const RadioPropsEq: EqClass.Eq<RadioProps> = EqClass.struct<
  Required<RadioProps>
>({
  name: string.Eq,
  options: EqClass.eqStrict,
  selectedValue: string.Eq,
  isDisabled: boolean.Eq,
  onChange: EqClass.eqStrict,
  className: string.Eq,
  key: EqClass.eqStrict,
  dataTest: string.Eq,
}) as unknown as EqClass.Eq<RadioProps>
