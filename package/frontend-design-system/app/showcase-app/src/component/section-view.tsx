import { ContentMemo as DsContentMemo } from '@rinn7e/realworld-design-system/element/content/component'
import * as EqClass from 'fp-ts/lib/Eq'
import * as S from 'fp-ts/lib/string'
import { type ReactNode, memo } from 'react'

export type SectionViewProps = {
  title: string
  boxClassName: string
  children: ReactNode
}

const SectionViewPropsEq: EqClass.Eq<SectionViewProps> = EqClass.struct({
  title: S.Eq,
  boxClassName: S.Eq,
  children: EqClass.eqStrict,
})

export const DEFAULT_SECTION_BOX_CLASS =
  'p-6 w-full flex flex-col gap-4 bg-white border-2 border-dotted border-gray-300 rounded-lg dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-200'

const SectionViewComponent = ({
  title,
  boxClassName,
  children,
}: SectionViewProps) => (
  <div
    data-component='SectionView'
    className='flex w-full flex-col gap-3 text-left'
  >
    <h3 className='text-sm font-semibold tracking-wider text-gray-700 uppercase dark:text-zinc-400'>
      {title}
    </h3>
    <DsContentMemo className={boxClassName}>{children}</DsContentMemo>
  </div>
)

export const SectionViewMemo = memo(
  SectionViewComponent,
  SectionViewPropsEq.equals,
)
