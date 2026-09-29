import { cn } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as B from 'fp-ts/lib/boolean'
import * as S from 'fp-ts/lib/string'
import { memo } from 'react'

import { type AppRoute, AppRouteEq } from '@/common/type/route'
import { Link } from '@/component/link'

export type HomeTabLinkProps = {
  isActive: boolean
  label: string
  route: AppRoute
}

const HomeTabLinkPropsEq: EqClass.Eq<HomeTabLinkProps> = EqClass.struct({
  isActive: B.Eq,
  label: S.Eq,
  route: AppRouteEq,
})

const HomeTabLinkComponent = ({ isActive, label, route }: HomeTabLinkProps) => (
  <Link
    route={route}
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
