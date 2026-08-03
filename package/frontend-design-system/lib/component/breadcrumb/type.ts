import * as A from 'fp-ts/lib/Array'
import * as EqClass from 'fp-ts/lib/Eq'
import type React from 'react'

export type BreadcrumbItem = {
  label: string
  href?: string
  isActive?: boolean
}

export const BreadcrumbItemEq: EqClass.Eq<BreadcrumbItem> = EqClass.struct<
  Required<BreadcrumbItem>
>({
  label: EqClass.eqString,
  href: EqClass.eqStrict,
  isActive: EqClass.eqStrict,
}) as unknown as EqClass.Eq<BreadcrumbItem>

export type BreadcrumbProps = {
  items: BreadcrumbItem[]
  separator?: 'bullet' | 'dot' | 'succeeds' | 'arrow'
  align?: 'left' | 'center' | 'right'
  onSelect?: (item: BreadcrumbItem) => void
  className?: string
  key?: React.Key
  dataTest?: string
}

export const BreadcrumbPropsEq: EqClass.Eq<BreadcrumbProps> = EqClass.struct<
  Required<BreadcrumbProps>
>({
  items: A.getEq(BreadcrumbItemEq),
  separator: EqClass.eqStrict,
  align: EqClass.eqStrict,
  onSelect: EqClass.eqStrict,
  className: EqClass.eqStrict,
  key: EqClass.eqStrict,
  dataTest: EqClass.eqStrict,
}) as unknown as EqClass.Eq<BreadcrumbProps>
