import { cn } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as B from 'fp-ts/lib/boolean'
import * as S from 'fp-ts/lib/string'
import { memo } from 'react'

import { type Destination, DestinationEq } from '@/common/type/destination'
import { Link } from '@/component/link'

export type HomeTabLinkProps = {
  isActive: boolean
  label: string
  destination: Destination
}

const HomeTabLinkPropsEq: EqClass.Eq<HomeTabLinkProps> = EqClass.struct({
  isActive: B.Eq,
  label: S.Eq,
  destination: DestinationEq,
})

const HomeTabLinkComponent = ({
  isActive,
  label,
  destination,
}: HomeTabLinkProps) => (
  <Link
    destination={destination}
    className={cn(
      'border-b-2 px-[16px] py-[8px] font-medium transition-colors',
      isActive
        ? 'border-green-500 text-green-500'
        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200',
    )}
    data-test='home-tab'
    aria-current={isActive ? 'page' : undefined}
  >
    {label}
  </Link>
)

export const HomeTabLinkMemo = memo(
  HomeTabLinkComponent,
  HomeTabLinkPropsEq.equals,
)
