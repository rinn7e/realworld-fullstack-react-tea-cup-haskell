import * as EqClass from 'fp-ts/lib/Eq'
import * as B from 'fp-ts/lib/boolean'
import type { Dispatcher } from 'tea-cup-fp'

export type Model = {
  isLoading: boolean
  showCode: boolean
}

export const ModelEq: EqClass.Eq<Model> = EqClass.struct({
  isLoading: B.Eq,
  showCode: B.Eq,
})

export type Msg = { _tag: 'ToggleLoading' } | { _tag: 'ToggleShowCode' }

export type Props = {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const PropsEq: EqClass.Eq<Props> = EqClass.struct({
  model: ModelEq,
  dispatch: EqClass.eqStrict,
})
