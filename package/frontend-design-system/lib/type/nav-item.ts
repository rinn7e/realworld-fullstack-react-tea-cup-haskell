import { UndefinableEq } from '@rinn7e/tea-cup-prelude'
import * as A from 'fp-ts/lib/Array'
import * as EqClass from 'fp-ts/lib/Eq'
import * as B from 'fp-ts/lib/boolean'
import * as S from 'fp-ts/lib/string'
import type { ReactNode } from 'react'

export type NavItemData = {
  key: string
  label: string
  href?: string
  isActive: boolean
  icon?: ReactNode
  isNewTab?: boolean
  children?: NavItemData[]
  /**
   * Controls the behavior of parent UI that has collapsible state (such as FloatingSidebar) when this item is clicked.
   * If true or omitted (default), selecting this leaf item will automatically close the parent collapsible container.
   * If false, selecting this item will keep the parent container open.
   * Note: When `children` exist, it implies `shouldCloseOnSelect` as false.
   */
  shouldCloseOnSelect?: boolean
}

export const NavItemDataEq: EqClass.Eq<NavItemData> = EqClass.struct<
  Required<NavItemData>
>({
  key: S.Eq,
  label: S.Eq,
  href: UndefinableEq(S.Eq),
  isActive: B.Eq,
  icon: UndefinableEq(EqClass.eqStrict),
  isNewTab: UndefinableEq(B.Eq),
  shouldCloseOnSelect: UndefinableEq(B.Eq),
  children: UndefinableEq(
    A.getEq(EqClass.fromEquals((x, y) => NavItemDataEq.equals(x, y))),
  ),
}) as unknown as EqClass.Eq<NavItemData>
