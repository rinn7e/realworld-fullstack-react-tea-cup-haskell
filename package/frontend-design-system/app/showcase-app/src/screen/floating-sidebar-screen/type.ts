import * as DsFloatingSidebar from '@rinn7e/realworld-design-system/component/floating-sidebar'
import * as EqClass from 'fp-ts/lib/Eq'
import * as B from 'fp-ts/lib/boolean'
import * as S from 'fp-ts/lib/string'
import type { Dispatcher } from 'tea-cup-fp'

export type Model = {
  showCode: boolean
  placement: 'left' | 'right'
  sidebar: DsFloatingSidebar.Model
}

export const ModelEq: EqClass.Eq<Model> = EqClass.struct({
  showCode: B.Eq,
  placement: S.Eq,
  sidebar: DsFloatingSidebar.ModelEq,
})

export type Msg =
  | { _tag: 'ToggleShowCode' }
  | { _tag: 'SetPlacement'; placement: 'left' | 'right' }
  | { _tag: 'OpenSidebar' }
  | { _tag: 'SidebarMsg'; subMsg: DsFloatingSidebar.Msg }

export type Props = {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const PropsEq: EqClass.Eq<Props> = EqClass.struct({
  model: ModelEq,
  dispatch: EqClass.eqStrict,
})
