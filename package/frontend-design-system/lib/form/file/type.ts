import { UndefinableEq } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as boolean from 'fp-ts/lib/boolean'
import * as string from 'fp-ts/lib/string'
import type React from 'react'

export type FileProps = {
  filename?: string
  ctaText?: string
  accept?: string
  isDisabled?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  name?: string
  id?: string
  className?: string
  dataTest?: string
}

export const FilePropsEq: EqClass.Eq<FileProps> = EqClass.struct<FileProps>({
  filename: UndefinableEq(string.Eq),
  ctaText: UndefinableEq(string.Eq),
  accept: UndefinableEq(string.Eq),
  isDisabled: UndefinableEq(boolean.Eq),
  onChange: EqClass.eqStrict,
  name: UndefinableEq(string.Eq),
  id: UndefinableEq(string.Eq),
  className: UndefinableEq(string.Eq),
  dataTest: UndefinableEq(string.Eq),
})
