import * as EqClass from 'fp-ts/lib/Eq'
import * as S from 'fp-ts/lib/string'
import type { Dispatcher } from 'tea-cup-fp'

export type Model = {
  activeTab: 'overview' | 'catalog'
}

export const ModelEq: EqClass.Eq<Model> = EqClass.struct({
  activeTab: S.Eq,
})

export type Msg =
  { _tag: 'SelectTab'; tab: 'overview' | 'catalog' } | { _tag: 'NoOp' }

export type Props = {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const PropsEq: EqClass.Eq<Props> = EqClass.struct({
  model: ModelEq,
  dispatch: EqClass.eqStrict,
})
