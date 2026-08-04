import * as EqClass from 'fp-ts/Eq'
import * as boolean from 'fp-ts/boolean'
import * as string from 'fp-ts/string'
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

export const InputPropsEq: EqClass.Eq<InputProps> = EqClass.struct<
  Required<InputProps>
>({
  type: EqClass.eqStrict,
  value: string.Eq,
  placeholder: string.Eq,
  size: EqClass.eqStrict,
  isRounded: boolean.Eq,
  isFullWidth: boolean.Eq,
  isError: boolean.Eq,
  isDisabled: boolean.Eq,
  onChange: EqClass.eqStrict,
  onFocus: EqClass.eqStrict,
  onBlur: EqClass.eqStrict,
  name: string.Eq,
  id: string.Eq,
  className: string.Eq,
  dataTest: string.Eq,
}) as unknown as EqClass.Eq<InputProps>
