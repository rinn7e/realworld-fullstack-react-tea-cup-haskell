import { UndefinableEq } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as boolean from 'fp-ts/lib/boolean'
import * as string from 'fp-ts/lib/string'
import type React from 'react'

export type ContainerProps = {
  children?: React.ReactNode
  isFluid?: boolean
  className?: string
  dataTest?: string
}

export const ContainerPropsEq: EqClass.Eq<ContainerProps> =
  EqClass.struct<ContainerProps>({
    children: EqClass.eqStrict,
    isFluid: UndefinableEq(boolean.Eq),
    className: UndefinableEq(string.Eq),
    dataTest: UndefinableEq(string.Eq),
  })
