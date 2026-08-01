import { domToPng } from 'modern-screenshot'
import React from 'react'

import { personas } from '../persona'
import { type Persona } from '../type'

export const ActionSection: React.FC<{
  currentPersonaId: string
  onClearCache: () => void
  onToggleCollapse: () => void
  onSwitchPersona: (persona: Persona) => void
  onHoverAction: (action: keyof Persona['actions'] | null) => void
}> = ({
  currentPersonaId,
  onClearCache,
  onToggleCollapse,
  onSwitchPersona,
  onHoverAction,
}) => {
  const personaList = [
    personas.flashAg,
    personas.hinata,
    personas.hinataAndroid,
  ]

  const takeScreenshot = async () => {
    onToggleCollapse()
    // Small delay to ensure the DOM has updated and panel is collapsed
    await new Promise((resolve) => setTimeout(resolve, 100))

    try {
      const dataUrl = await domToPng(document.body, {
        filter: (node) => {
          if (
            node instanceof HTMLElement &&
            node.hasAttribute('data-html2canvas-ignore')
          ) {
            return false
          }
          return true
        },
      })

      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `system-capture-${new Date().getTime()}.png`
      link.click()
    } catch (error) {
      console.error('Screenshot failed:', error)
    }
  }

  return (
    <div className='space-y-[12px]'>
      <div className='space-y-[8px]'>
        <button
          type='button'
          onClick={onClearCache}
          onMouseEnter={() => onHoverAction('clearCache')}
          onMouseLeave={() => onHoverAction(null)}
          className='group border-theme-primary/20 bg-theme-secondary/50 flex w-full items-center justify-between rounded-[8px] border p-[16px] text-left transition-all hover:border-red-500/50 hover:bg-red-500/10'
        >
          <span className='text-[14px] font-black tracking-wider text-white uppercase'>
            Clear Cache and Reload
          </span>
          <div className='opacity-0 transition-opacity group-hover:opacity-100'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-[18px] w-[18px] text-red-500'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M13 7l5 5m0 0l-5 5m5-5H6'
              />
            </svg>
          </div>
        </button>

        <button
          type='button'
          onClick={takeScreenshot}
          onMouseEnter={() => onHoverAction('screenshot')}
          onMouseLeave={() => onHoverAction(null)}
          className='group border-theme-primary/20 bg-theme-secondary/50 hover:border-theme-primary/50 hover:bg-theme-primary/10 flex w-full items-center justify-between rounded-[8px] border p-[16px] text-left transition-all'
        >
          <span className='text-[14px] font-black tracking-wider text-white uppercase'>
            Take Screenshot
          </span>
          <div className='opacity-0 transition-opacity group-hover:opacity-100'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='text-theme-primary h-[18px] w-[18px]'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M13 7l5 5m0 0l-5 5m5-5H6'
              />
            </svg>
          </div>
        </button>

        <button
          type='button'
          onMouseEnter={() => onHoverAction('debug')}
          onMouseLeave={() => onHoverAction(null)}
          className='group border-theme-primary/20 bg-theme-secondary/50 hover:border-theme-primary/50 hover:bg-theme-primary/10 flex w-full items-center justify-between rounded-[8px] border p-[16px] text-left transition-all'
        >
          <span className='text-[14px] font-black tracking-wider text-white uppercase'>
            Show Debug
          </span>
          <div className='opacity-0 transition-opacity group-hover:opacity-100'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='text-theme-primary h-[18px] w-[18px]'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M13 7l5 5m0 0l-5 5m5-5H6'
              />
            </svg>
          </div>
        </button>

        <button
          type='button'
          onClick={() => window.history.back()}
          onMouseEnter={() => onHoverAction('back')}
          onMouseLeave={() => onHoverAction(null)}
          className='group border-theme-primary/20 bg-theme-secondary/50 hover:border-theme-primary/50 hover:bg-theme-primary/10 flex w-full items-center justify-between rounded-[8px] border p-[16px] text-left transition-all'
        >
          <span className='text-[14px] font-black tracking-wider text-white uppercase'>
            Trigger Browser Back Button
          </span>
          <div className='opacity-0 transition-opacity group-hover:opacity-100'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='text-theme-primary h-[18px] w-[18px]'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M13 7l5 5m0 0l-5 5m5-5H6'
              />
            </svg>
          </div>
        </button>
      </div>

      <div className='bg-theme-primary/10 my-[8px] h-[1px] w-full' />

      <div className='space-y-[8px]'>
        <span className='text-theme-primary pl-[4px] text-[10px] font-bold tracking-widest uppercase'>
          Persona Selection
        </span>
        <div className='grid grid-cols-3 gap-[8px]'>
          {personaList.map((p) => (
            <button
              type='button'
              key={p.id}
              onClick={() => onSwitchPersona(p)}
              className={`flex flex-col items-center justify-center rounded-[8px] border p-[8px] transition-all ${
                currentPersonaId === p.id
                  ? 'border-theme-primary bg-theme-primary/20 shadow-[0_0_10px_var(--color-primary)]'
                  : 'border-theme-primary/20 bg-theme-secondary/50 hover:border-theme-primary/40 hover:bg-theme-primary/5'
              }`}
            >
              <span
                className={`text-[10px] font-black tracking-tight uppercase ${currentPersonaId === p.id ? 'text-white' : 'text-white/40'}`}
              >
                {p.id === 'hinata'
                  ? 'Hyuga'
                  : p.id === 'hinata-android'
                    ? 'Model-B'
                    : 'Flash AG'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
