import * as EqClass from 'fp-ts/Eq'
import * as boolean from 'fp-ts/boolean'
import * as string from 'fp-ts/string'
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
  key?: React.Key
  dataTest?: string
}

export const FilePropsEq: EqClass.Eq<FileProps> = EqClass.struct<
  Required<FileProps>
>({
  filename: string.Eq,
  ctaText: string.Eq,
  accept: string.Eq,
  isDisabled: boolean.Eq,
  onChange: EqClass.eqStrict,
  name: string.Eq,
  id: string.Eq,
  className: string.Eq,
  key: EqClass.eqStrict,
  dataTest: string.Eq,
}) as unknown as EqClass.Eq<FileProps>
