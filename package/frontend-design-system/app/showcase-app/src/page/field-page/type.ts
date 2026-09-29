import * as EqClass from 'fp-ts/lib/Eq'
import * as B from 'fp-ts/lib/boolean'
import * as S from 'fp-ts/lib/string'
import type { Dispatcher } from 'tea-cup-fp'

export type Model = {
  showCode: boolean
  value: string
}

export const ModelEq: EqClass.Eq<Model> = EqClass.struct({
  showCode: B.Eq,
  value: S.Eq,
})

export type Msg =
  { _tag: 'ToggleShowCode' } | { _tag: 'UpdateValue'; value: string }

export type Props = {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const PropsEq: EqClass.Eq<Props> = EqClass.struct({
  model: ModelEq,
  dispatch: EqClass.eqStrict,
})
