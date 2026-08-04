import * as EqClass from 'fp-ts/Eq'
import * as string from 'fp-ts/string'
import type React from 'react'

export type MediaObjectProps = {
  left?: React.ReactNode
  children?: React.ReactNode
  right?: React.ReactNode
  className?: string
  dataTest?: string
}

export const MediaObjectPropsEq: EqClass.Eq<MediaObjectProps> = EqClass.struct<
  Required<MediaObjectProps>
>({
  left: EqClass.eqStrict,
  children: EqClass.eqStrict,
  right: EqClass.eqStrict,
  className: string.Eq,
  dataTest: string.Eq,
}) as unknown as EqClass.Eq<MediaObjectProps>
