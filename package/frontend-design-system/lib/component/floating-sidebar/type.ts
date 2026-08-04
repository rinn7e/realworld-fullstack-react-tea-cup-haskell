import * as A from 'fp-ts/lib/Array'
import * as EqClass from 'fp-ts/lib/Eq'
import * as string from 'fp-ts/lib/string'

import * as Animate from '../../type/animate'
import { type NavItemData, NavItemDataEq } from '../../type/nav-item'

export type Model = {
  status: Animate.Animate<null>
  expandedKeys?: ReadonlyArray<string>
}

export const ModelEq: EqClass.Eq<Model> = EqClass.struct({
  status: Animate.getEq(EqClass.eqStrict),
  expandedKeys: A.getEq(string.Eq),
}) as unknown as EqClass.Eq<Model>

export type Msg =
  | { _tag: 'Toggle'; open: boolean }
  | { _tag: 'SetState'; state: Animate.AnimateState }
  | { _tag: 'ToggleExpand'; key: string }
  | { _tag: 'ClickItem'; item: NavItemData }

export type FloatingSidebarProps = {
  model: Model
  items: NavItemData[]
  dispatch: (msg: Msg) => void
  placement?: 'left' | 'right'
  className?: string
  dataTest?: string
}

export const FloatingSidebarPropsEq: EqClass.Eq<FloatingSidebarProps> =
  EqClass.struct<Required<FloatingSidebarProps>>({
    model: ModelEq,
    items: A.getEq(NavItemDataEq),
    dispatch: EqClass.eqStrict,
    placement: string.Eq,
    className: string.Eq,
    dataTest: string.Eq,
  }) as unknown as EqClass.Eq<FloatingSidebarProps>
