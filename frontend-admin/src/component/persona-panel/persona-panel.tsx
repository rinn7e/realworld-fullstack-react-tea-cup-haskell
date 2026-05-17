import React from 'react'
import { createPortal } from 'react-dom'
import { type Dispatcher } from 'tea-cup-fp'

/**
 * PersonaPanel: A clean terminal interface for Hinata's injected soul.
 * Refactored into sub-components for better organization.
 */

import { type Theme } from '@/theme/type'
import { type ColorScheme } from '@/theme/util'

import { ActionSection } from './sub-component/action-section'
import { BrowserInfoSection } from './sub-component/browser-info-section'
import { DialogueSection } from './sub-component/dialogue-section'
import { HeroSection } from './sub-component/hero-section'
import { PanelHeader } from './sub-component/panel-header'
import { type Model, type Msg } from './type'

interface Props {
  model: Model
  theme: Theme
  colorScheme: ColorScheme
  dispatch: Dispatcher<Msg>
  onSwitchTheme: (theme: Theme) => void
}

const GearIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className={`${className} animate-[spin_10s_linear_infinite]`}
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z'
    />
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
    />
  </svg>
)

export const PersonaPanel: React.FC<Props> = ({
  model,
  theme,
  colorScheme,
  dispatch,
  onSwitchTheme: _onSwitchTheme,
}) => {
  const clearCacheAndReload = () => {
    localStorage.clear()
    window.location.reload()
  }

  const persona = model.currentPersona

  const panelContent = (
    <>
      {!model.isCollapse && (
        <div
          data-html2canvas-ignore
          className='fixed inset-0 z-[9998] bg-transparent'
          onClick={() => dispatch({ _tag: 'ToggleCollapse' })}
        />
      )}
      <div
        data-html2canvas-ignore
        className={`fixed -bottom-[16px] -left-[16px] z-[9999] ${
          model.isCollapse ? 'h-[48px] w-[48px]' : 'w-[480px]'
        }`}
      >
        {model.isCollapse ? (
          <button
            type='button'
            onClick={() => dispatch({ _tag: 'ToggleCollapse' })}
            className='text-theme-primary border-theme-primary/30 flex h-[48px] w-[48px] items-start justify-end rounded-full border bg-black pt-[8px] pr-[8px] shadow-xl'
          >
            <GearIcon className='h-[20px] w-[20px] animate-[spin_10s_linear_infinite]' />
          </button>
        ) : (
          <div className='border-theme-primary/30 relative mb-[24px] ml-[24px] min-h-[600px] overflow-hidden rounded-[16px] border bg-black shadow-2xl'>
            <HeroSection
              portraitUrl={persona.portraitUrl}
              hoveredDialogue={
                model.hoveredAction
                  ? (persona.actions as any)[model.hoveredAction]
                  : null
              }
            />

            <div className='relative z-10 flex h-full flex-col'>
              {/* Clear space for the face */}
              <div className='h-[320px] w-full' />

              {/* Blurred content area */}
              <div className='border-theme-primary/20 flex-1 border-t bg-black/40 p-[24px] backdrop-blur-md'>
                <PanelHeader
                  name={persona.name}
                  onToggleDetails={() => dispatch({ _tag: 'ToggleDetails' })}
                  onToggleCollapse={() => dispatch({ _tag: 'ToggleCollapse' })}
                />

                <DialogueSection
                  showDetails={model.showDetails}
                  bio={persona.bio}
                  dialogue={persona.dialogue}
                  onToggleDetails={() => dispatch({ _tag: 'ToggleDetails' })}
                />

                {!model.showDetails && (
                  <div className='mt-[24px] space-y-[24px]'>
                    <BrowserInfoSection
                      themeName={theme.name}
                      colorScheme={colorScheme}
                    />
                    <ActionSection
                      currentPersonaId={persona.id}
                      onClearCache={clearCacheAndReload}
                      onToggleCollapse={() =>
                        dispatch({ _tag: 'ToggleCollapse' })
                      }
                      onSwitchPersona={(p) =>
                        dispatch({ _tag: 'SwitchPersona', persona: p })
                      }
                      onHoverAction={(action) =>
                        dispatch({ _tag: 'SetHoveredAction', action })
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )

  return createPortal(panelContent, document.body)
}
