import React from 'react'

export const HeroSection: React.FC<{
  portraitUrl: string
  hoveredDialogue: string | null
}> = ({ portraitUrl, hoveredDialogue }) => {
  return (
    <div className='absolute inset-0 flex items-start justify-center overflow-hidden bg-black'>
      <div className='animate-persona flex h-full w-full items-start justify-center p-[40px]'>
        <img
          src={portraitUrl}
          className='h-full w-full object-contain object-top'
          alt='Persona Portrait'
        />
      </div>
      <div className='absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black' />

      {/* Floating Speech Bubble */}
      {hoveredDialogue && (
        <div className='animate-in zoom-in-95 fade-in slide-in-from-top-4 absolute top-[60px] left-1/2 z-[30] w-[85%] -translate-x-1/2 duration-300'>
          <div className='border-theme-primary/40 relative rounded-[20px] border bg-black/80 p-[20px] shadow-[0_0_30px_rgba(var(--color-primary),0.3)] ring-1 ring-white/10 backdrop-blur-xl'>
            <div className='text-center text-[15px] leading-relaxed tracking-tight text-white italic'>
              "{hoveredDialogue}"
            </div>
            {/* Speech bubble arrow */}
            <div className='border-theme-primary/40 absolute -bottom-[6px] left-1/2 h-[12px] w-[12px] -translate-x-1/2 rotate-45 border-r border-b bg-black/80' />
          </div>
        </div>
      )}
    </div>
  )
}
