import type { Eq } from 'fp-ts/lib/Eq'

import type { SidebarItemData } from '@/component/sidebar'
import { SidebarItemDataEq } from '@/component/sidebar'

export type Props = {
  items: SidebarItemData[]
  unavailableMode?: boolean
  onToggleSidebar?: () => void
}

export const PropsEq: Eq<Props> = {
  equals: (x, y) =>
    x.unavailableMode === y.unavailableMode &&
    x.items.length === y.items.length &&
    x.items.every((item, i) => SidebarItemDataEq.equals(item, y.items[i])),
}
