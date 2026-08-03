import * as EqClass from 'fp-ts/Eq'
import * as string from 'fp-ts/string'
import type React from 'react'

export interface DotLoadingProps {
  className?: string
  key?: React.Key
  dataTest?: string
}

export const DotLoadingPropsEq: EqClass.Eq<DotLoadingProps> = EqClass.struct<
  Required<DotLoadingProps>
>({
  className: string.Eq,
  key: EqClass.eqStrict,
  dataTest: string.Eq,
}) as unknown as EqClass.Eq<DotLoadingProps>
