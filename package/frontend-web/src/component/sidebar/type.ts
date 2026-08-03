import * as A from 'fp-ts/lib/Array'
import { EqAlways } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import type { Dispatcher } from 'tea-cup-fp'

import * as Animate from '@/common/type/animate'
import {
  type NavItemData as DsNavItemData,
  NavItemDataEq as DsNavItemDataEq,
} from '@rinn7e/realworld-design-system/type/nav-item'

export type Model = {
  status: Animate.Animate<null>
}

export const ModelEq: EqClass.Eq<Model> = EqClass.struct({
  status: Animate.getEq(EqAlways),
})

export type Msg =
  | { _tag: 'Toggle'; open: boolean }
  | { _tag: 'SetState'; state: Animate.AnimateState }

export type Props = {
  model: Model
  dispatch: Dispatcher<Msg>
  items: DsNavItemData[]
}

export const PropsEq: EqClass.Eq<Props> = EqClass.struct<Required<Props>>({
  model: ModelEq,
  dispatch: EqClass.eqStrict,
  items: A.getEq(DsNavItemDataEq),
}) as unknown as EqClass.Eq<Props>
