import { cn } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as S from 'fp-ts/lib/string'
import { memo } from 'react'

import type { LogLevel } from '@/common/api'

export type LevelBadgeProps = {
  level: LogLevel
}

const LevelBadgePropsEq: EqClass.Eq<LevelBadgeProps> = EqClass.struct({
  level: S.Eq,
})

const levelBadgeClass = (level: LogLevel): string => {
  switch (level) {
    case 'ERROR':
      return 'bg-red-50 text-red-600 border-red-100'
    case 'WARNING':
      return 'bg-amber-50 text-amber-600 border-amber-100'
    case 'INFO':
      return 'bg-blue-50 text-blue-600 border-blue-100'
    case 'DEBUG':
      return 'bg-slate-50 text-slate-600 border-slate-100'
  }
}

const LevelBadgeComponent = ({ level }: LevelBadgeProps) => (
  <span
    className={cn(
      'rounded-full border px-[8px] py-[2px] text-[11px] font-bold tracking-tight uppercase',
      levelBadgeClass(level),
    )}
  >
    {level}
  </span>
)

export const LevelBadgeMemo = memo(
  LevelBadgeComponent,
  LevelBadgePropsEq.equals,
)
