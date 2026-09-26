import { EqAlways } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'

import type { AppRoute } from '@/common/type/route'

export type Model = Record<string, never>

export const ModelEq: EqClass.Eq<Model> = EqAlways
export type Msg = { _tag: 'NoOp' }

export type Props = {
  navigateRoute: (route: AppRoute) => void
}

export const PropsEq: EqClass.Eq<Props> = EqClass.struct({
  navigateRoute: EqClass.eqStrict,
})
