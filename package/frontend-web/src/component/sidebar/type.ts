import { EqAlways } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import type { Dispatcher } from 'tea-cup-fp'

import * as Animate from '@/common/type/animate'
import { type NavItemData, mkNavItemDataEq } from '@/common/type/nav-item'

export type Model = {
  status: Animate.Animate<null>
}

export const ModelEq: EqClass.Eq<Model> = EqClass.struct({
  status: Animate.getEq(EqAlways),
})

export type Msg =
  | { _tag: 'Toggle'; open: boolean }
  | { _tag: 'SetState'; state: Animate.AnimateState }

export type Props<PMsg> = {
  model: Model
  dispatch: Dispatcher<Msg>
  items: NavItemData<PMsg>[]
}

export const mkPropsEq = <PMsg>(msgEq: EqClass.Eq<PMsg>): EqClass.Eq<Props<PMsg>> => {
  const itemEq = mkNavItemDataEq(msgEq)
  return {
    equals: (x, y) =>
      ModelEq.equals(x.model, y.model) &&
      x.items.length === y.items.length &&
      x.items.every((item, i) => itemEq.equals(item, y.items[i])),
  }
}

export const PropsEq: EqClass.Eq<Props<unknown>> = mkPropsEq(EqAlways)
