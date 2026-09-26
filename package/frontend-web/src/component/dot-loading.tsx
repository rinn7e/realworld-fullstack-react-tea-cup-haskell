import { cn } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as S from 'fp-ts/lib/string'
import { memo } from 'react'

export type DotLoadingProps = {
  className: string
}

const DotLoadingPropsEq: EqClass.Eq<DotLoadingProps> = EqClass.struct({
  className: S.Eq,
})

const DotLoadingComponent = ({ className }: DotLoadingProps) => {
  return (
    <span className={cn('inline-flex gap-[2px]', className)}>
      <span className='animate-flicker'>.</span>
      <span className='animate-flicker delay-200'>.</span>
      <span className='animate-flicker delay-400'>.</span>
    </span>
  )
}

export const DotLoadingMemo = memo(
  DotLoadingComponent,
  DotLoadingPropsEq.equals,
)
