import { EqAlways } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as B from 'fp-ts/lib/boolean'
import * as S from 'fp-ts/lib/string'
import React, { memo } from 'react'

export type DialogueSectionProps = {
  showDetails: boolean
  bio: string
  dialogue: string
  onToggleDetails: () => void
}

const DialogueSectionPropsEq: EqClass.Eq<DialogueSectionProps> = EqClass.struct(
  {
    showDetails: B.Eq,
    bio: S.Eq,
    dialogue: S.Eq,
    onToggleDetails: EqAlways,
  },
)

const DialogueSectionComponent = ({
  showDetails,
  bio,
  dialogue,
  onToggleDetails,
}: DialogueSectionProps) => (
  <div className='pb-[24px] text-[13px] leading-relaxed font-medium text-white/90 italic'>
    {showDetails ? (
      <div className='flex flex-col items-start gap-[12px]'>
        <p>"{bio}"</p>
        <button
          type='button'
          onClick={onToggleDetails}
          className='text-theme-primary hover:text-theme-primary/70 text-[10px] font-bold uppercase'
        >
          Back
        </button>
      </div>
    ) : (
      <p>"{dialogue}"</p>
    )}
  </div>
)

export const DialogueSectionMemo = memo(
  DialogueSectionComponent,
  DialogueSectionPropsEq.equals,
)
