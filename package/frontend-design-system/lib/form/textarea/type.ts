import { UndefinableEq } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as boolean from 'fp-ts/lib/boolean'
import * as number from 'fp-ts/lib/number'
import * as string from 'fp-ts/lib/string'
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
  dataTest?: string
}

export const TextareaPropsEq: EqClass.Eq<TextareaProps> =
  EqClass.struct<TextareaProps>({
    value: UndefinableEq(string.Eq),
    placeholder: UndefinableEq(string.Eq),
    rows: UndefinableEq(number.Eq),
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
