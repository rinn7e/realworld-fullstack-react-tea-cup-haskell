import { UndefinableEq } from '@rinn7e/tea-cup-prelude'
import * as A from 'fp-ts/lib/Array'
import * as EqClass from 'fp-ts/lib/Eq'
import * as RA from 'fp-ts/lib/ReadonlyArray'
import * as number from 'fp-ts/lib/number'
import * as string from 'fp-ts/lib/string'

import * as Animate from '../../type/animate'
import { type NavItemData, NavItemDataEq } from '../../type/nav-item'

export type Model = {
  status: Animate.Animate<null>
  expandedKeys: ReadonlyArray<string>
}

export const ModelEq: EqClass.Eq<Model> = EqClass.struct<Model>({
  status: Animate.getEq(EqClass.eqStrict),
  expandedKeys: RA.getEq(string.Eq),
})

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
  EqClass.struct<FloatingSidebarProps>({
    model: ModelEq,
    items: A.getEq(NavItemDataEq),
    dispatch: EqClass.eqStrict,
    placement: UndefinableEq(string.Eq),
    className: UndefinableEq(string.Eq),
    dataTest: UndefinableEq(string.Eq),
  })

export type FloatingSidebarItemProps = {
  item: NavItemData
  depth: number
  expandedKeys: ReadonlyArray<string>
  dispatch: (msg: Msg) => void
}

export const FloatingSidebarItemPropsEq: EqClass.Eq<FloatingSidebarItemProps> =
  EqClass.struct({
    item: NavItemDataEq,
    depth: number.Eq,
    expandedKeys: RA.getEq(string.Eq),
    dispatch: EqClass.eqStrict,
  })
