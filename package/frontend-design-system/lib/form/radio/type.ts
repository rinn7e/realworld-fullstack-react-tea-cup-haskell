import { UndefinableEq } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as boolean from 'fp-ts/lib/boolean'
import * as string from 'fp-ts/lib/string'
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
  dataTest?: string
}

export const RadioPropsEq: EqClass.Eq<RadioProps> = EqClass.struct<RadioProps>({
  name: string.Eq,
  options: EqClass.eqStrict,
  selectedValue: UndefinableEq(string.Eq),
  isDisabled: UndefinableEq(boolean.Eq),
  onChange: EqClass.eqStrict,
  className: UndefinableEq(string.Eq),
  dataTest: UndefinableEq(string.Eq),
})
