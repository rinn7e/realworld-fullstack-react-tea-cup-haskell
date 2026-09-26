import { UndefinableEq } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as string from 'fp-ts/lib/string'

export type DotLoadingProps = {
  className?: string
  dataTest?: string
}

export const DotLoadingPropsEq: EqClass.Eq<DotLoadingProps> =
  EqClass.struct<DotLoadingProps>({
    className: UndefinableEq(string.Eq),
    dataTest: UndefinableEq(string.Eq),
  })
