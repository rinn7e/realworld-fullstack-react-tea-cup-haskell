import * as A from 'fp-ts/lib/Array'
import * as EqClass from 'fp-ts/lib/Eq'
import type React from 'react'

export type MenuItem = {
  id: string
  label: string
  isActive?: boolean
}

export const MenuItemEq: EqClass.Eq<MenuItem> = EqClass.struct<
  Required<MenuItem>
>({
  id: EqClass.eqString,
  label: EqClass.eqString,
  isActive: EqClass.eqStrict,
}) as unknown as EqClass.Eq<MenuItem>

export type MenuCategory = {
  title: string
  items: MenuItem[]
}

export const MenuCategoryEq: EqClass.Eq<MenuCategory> = EqClass.struct({
  title: EqClass.eqString,
  items: A.getEq(MenuItemEq),
})

export type Model = {
  activeId: string | null
}

export const ModelEq: EqClass.Eq<Model> = EqClass.struct({
  activeId: EqClass.eqStrict,
})

export type Msg = { _tag: 'Select'; id: string }

export type MenuProps = {
  categories: MenuCategory[]
  model: Model
  dispatch: (msg: Msg) => void
  className?: string
  key?: React.Key
  dataTest?: string
}

export const MenuPropsEq: EqClass.Eq<MenuProps> = EqClass.struct<
  Required<MenuProps>
>({
  categories: A.getEq(MenuCategoryEq),
  model: ModelEq,
  dispatch: EqClass.eqStrict,
  className: EqClass.eqStrict,
  key: EqClass.eqStrict,
  dataTest: EqClass.eqStrict,
}) as unknown as EqClass.Eq<MenuProps>
