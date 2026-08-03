import type React from 'react'
import * as EqClass from 'fp-ts/lib/Eq'
import * as string from 'fp-ts/lib/string'

export type BlockProps = {
  children: () => React.ReactNode
  className?: string
  key?: React.Key
  dataTest?: string
}

export const BlockPropsEq: EqClass.Eq<BlockProps> = EqClass.struct<Required<BlockProps>>({
  children: EqClass.eqStrict,
  className: string.Eq,
  key: EqClass.eqStrict,
  dataTest: string.Eq,
}) as unknown as EqClass.Eq<BlockProps>
