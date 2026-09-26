import * as DsSidebar from '@rinn7e/realworld-design-system/component/sidebar'
import * as EqClass from 'fp-ts/lib/Eq'
import * as B from 'fp-ts/lib/boolean'
import type { Dispatcher } from 'tea-cup-fp'

export type Model = {
  showCode: boolean
  sidebar: DsSidebar.Model
}

export const ModelEq: EqClass.Eq<Model> = EqClass.struct({
  showCode: B.Eq,
  sidebar: DsSidebar.ModelEq,
})

export type Msg =
  { _tag: 'ToggleShowCode' } | { _tag: 'SidebarMsg'; subMsg: DsSidebar.Msg }

export type Props = {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const PropsEq: EqClass.Eq<Props> = EqClass.struct({
  model: ModelEq,
  dispatch: EqClass.eqStrict,
})
