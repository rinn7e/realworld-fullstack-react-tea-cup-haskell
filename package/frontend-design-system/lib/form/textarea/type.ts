import * as boolean from 'fp-ts/boolean'
import * as EqClass from 'fp-ts/Eq'
import * as number from 'fp-ts/number'
import * as string from 'fp-ts/string'
import type React from 'react'

export type TextareaProps = {
  value?: string
  placeholder?: string
  rows?: number
  isError?: boolean
  isDisabled?: boolean
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void
  name?: string
  id?: string
  className?: string
  key?: React.Key
  dataTest?: string
}

export const TextareaPropsEq: EqClass.Eq<TextareaProps> = EqClass.struct<
  Required<TextareaProps>
>({
  value: string.Eq,
  placeholder: string.Eq,
  rows: number.Eq,
  isError: boolean.Eq,
  isDisabled: boolean.Eq,
  onChange: EqClass.eqStrict,
  onFocus: EqClass.eqStrict,
  onBlur: EqClass.eqStrict,
  name: string.Eq,
  id: string.Eq,
  className: string.Eq,
  key: EqClass.eqStrict,
  dataTest: string.Eq,
}) as unknown as EqClass.Eq<TextareaProps>
