import { UndefinableEq } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as boolean from 'fp-ts/lib/boolean'
import * as string from 'fp-ts/lib/string'
import type React from 'react'

export type InputSize = 'small' | 'normal' | 'medium' | 'large'

export type InputProps = {
  type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url'
  value?: string
  placeholder?: string
  size?: InputSize
  isRounded?: boolean
  isFullWidth?: boolean
  isError?: boolean
  isDisabled?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  name?: string
  id?: string
  className?: string
  dataTest?: string
}

export const InputPropsEq: EqClass.Eq<InputProps> = EqClass.struct<InputProps>({
  type: EqClass.eqStrict,
  value: UndefinableEq(string.Eq),
  placeholder: UndefinableEq(string.Eq),
  size: EqClass.eqStrict,
  isRounded: UndefinableEq(boolean.Eq),
  isFullWidth: UndefinableEq(boolean.Eq),
  isError: UndefinableEq(boolean.Eq),
  isDisabled: UndefinableEq(boolean.Eq),
  onChange: EqClass.eqStrict,
  onFocus: EqClass.eqStrict,
  onBlur: EqClass.eqStrict,
  name: UndefinableEq(string.Eq),
  id: UndefinableEq(string.Eq),
  className: UndefinableEq(string.Eq),
  dataTest: UndefinableEq(string.Eq),
})
