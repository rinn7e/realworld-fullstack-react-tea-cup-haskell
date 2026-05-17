import React from 'react'

export const DialogueSection: React.FC<{
  showDetails: boolean
  bio: string
  dialogue: string
  onToggleDetails: () => void
}> = ({ showDetails, bio, dialogue, onToggleDetails }) => (
  <div className='mb-[24px] text-[13px] leading-relaxed font-medium text-white/90 italic'>
    {showDetails ? (
      <div className='space-y-[12px]'>
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
