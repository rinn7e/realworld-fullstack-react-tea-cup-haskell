import { EqAlways } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'

import type { Destination } from '@/common/type/destination'

export type Model = Record<string, never>

export const ModelEq: EqClass.Eq<Model> = EqAlways
export type Msg = { _tag: 'NoOp' }

export type Props = {
  navigate: (destination: Destination) => void
}

export const PropsEq: EqClass.Eq<Props> = EqClass.struct({
  navigate: EqClass.eqStrict,
})
