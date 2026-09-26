import { EqAlways } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import type { Dispatcher } from 'tea-cup-fp'

export type Model = Record<string, never>

export const ModelEq: EqClass.Eq<Model> = EqAlways
export type Msg = { readonly _tag: 'NoOp' }

export type Props = {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const PropsEq: EqClass.Eq<Props> = EqClass.struct({
  model: ModelEq,
  dispatch: EqClass.eqStrict,
})
