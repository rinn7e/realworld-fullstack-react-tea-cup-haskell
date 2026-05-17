import React from 'react'

export const PanelHeader: React.FC<{
  name: string
  onToggleDetails: () => void
  onToggleCollapse: () => void
}> = ({ name, onToggleDetails, onToggleCollapse }) => (
  <div className='border-theme-primary/20 flex items-center justify-between border-b p-[24px]'>
    <button
      type='button'
      onClick={onToggleDetails}
      className='text-theme-primary decoration-theme-primary/50 text-[18px] font-black tracking-widest uppercase underline-offset-4 hover:underline'
    >
      {name}
    </button>
    <button
      type='button'
      onClick={onToggleCollapse}
      className='text-white/40 transition-colors hover:text-white'
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='h-[24px] w-[24px]'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M6 18L18 6M6 6l12 12'
        />
      </svg>
    </button>
  </div>
)
