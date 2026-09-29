import * as DsNavbar from '@rinn7e/realworld-design-system/component/navbar'
import * as EqClass from 'fp-ts/lib/Eq'
import * as B from 'fp-ts/lib/boolean'
import type { Dispatcher } from 'tea-cup-fp'

export type Model = {
  showCode: boolean
  navbarModel: DsNavbar.Model
}

export const ModelEq: EqClass.Eq<Model> = EqClass.struct({
  showCode: B.Eq,
  navbarModel: DsNavbar.ModelEq,
})

export type Msg =
  { _tag: 'ToggleShowCode' } | { _tag: 'NavbarMsg'; subMsg: DsNavbar.Msg }

export type Props = {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const PropsEq: EqClass.Eq<Props> = EqClass.struct({
  model: ModelEq,
  dispatch: EqClass.eqStrict,
})
