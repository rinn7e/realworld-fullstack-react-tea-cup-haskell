import * as boolean from 'fp-ts/boolean'
import * as EqClass from 'fp-ts/Eq'
import * as string from 'fp-ts/string'
import type React from 'react'

export type ContainerProps = {
  children: () => React.ReactNode
  isFluid?: boolean
  className?: string
  key?: React.Key
  dataTest?: string
}

export const ContainerPropsEq: EqClass.Eq<ContainerProps> = EqClass.struct<
  Required<ContainerProps>
>({
  children: EqClass.eqStrict,
  isFluid: boolean.Eq,
  className: string.Eq,
  key: EqClass.eqStrict,
  dataTest: string.Eq,
}) as unknown as EqClass.Eq<ContainerProps>
