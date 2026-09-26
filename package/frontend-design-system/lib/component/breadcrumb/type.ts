import * as A from 'fp-ts/lib/Array'
import * as EqClass from 'fp-ts/lib/Eq'

export type BreadcrumbItem = {
  label: string
  href?: string
  isActive?: boolean
}

export const BreadcrumbItemEq: EqClass.Eq<BreadcrumbItem> =
  EqClass.struct<BreadcrumbItem>({
    label: EqClass.eqString,
    href: EqClass.eqStrict,
    isActive: EqClass.eqStrict,
  })

export type BreadcrumbAlign = 'left' | 'center' | 'right'

export type BreadcrumbProps = {
  items: BreadcrumbItem[]
  separator?: 'bullet' | 'dot' | 'succeeds' | 'arrow'
  align?: BreadcrumbAlign
  onSelect?: (item: BreadcrumbItem) => void
  className?: string
  dataTest?: string
}

export const BreadcrumbPropsEq: EqClass.Eq<BreadcrumbProps> =
  EqClass.struct<BreadcrumbProps>({
    items: A.getEq(BreadcrumbItemEq),
    separator: EqClass.eqStrict,
    align: EqClass.eqStrict,
    onSelect: EqClass.eqStrict,
    className: EqClass.eqStrict,
    dataTest: EqClass.eqStrict,
  })
