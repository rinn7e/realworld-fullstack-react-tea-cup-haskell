import {
  ArrowPathIcon,
  Cog6ToothIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid'
import React from 'react'
import { createPortal } from 'react-dom'

import type { Model, Msg } from './type'

interface Props {
  model: Model
  dispatch: (msg: Msg) => void
}

export const DebugPanelComponent: React.FC<Props> = ({ model, dispatch }) => {
  const clearCacheAndReload = () => {
    localStorage.clear()
    window.location.reload()
  }

  const panelContent = (
    <div
      className={`fixed right-4 bottom-4 z-[9999] transition-all duration-300 ease-in-out ${model.isCollapse ? 'h-12 w-12' : 'w-64'}`}
    >
      {model.isCollapse ? (
        <button
          type='button'
          onClick={() => dispatch({ _tag: 'ToggleCollapse' })}
          className='flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-white shadow-xl transition-colors hover:bg-black'
          title='Open Debug Panel'
        >
          <Cog6ToothIcon className='h-6 w-6' />
        </button>
      ) : (
        <div className='overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 text-white shadow-2xl'>
          <div className='flex items-center justify-between border-b border-gray-800 p-4'>
            <h3 className='flex items-center gap-2 font-bold'>
              <Cog6ToothIcon className='text-brand-primary h-5 w-5' />
              Debug Panel
            </h3>
            <button
              type='button'
              onClick={() => dispatch({ _tag: 'ToggleCollapse' })}
              className='text-gray-400 transition-colors hover:text-white'
            >
              <XMarkIcon className='h-5 w-5' />
            </button>
          </div>
          <div className='space-y-4 p-4'>
            <div className='space-y-2'>
              <p className='text-xs font-bold tracking-wider text-gray-500 uppercase'>
                Shortcuts
              </p>
              <button
                type='button'
                onClick={clearCacheAndReload}
                className='group flex w-full items-center gap-3 rounded-xl bg-gray-800 p-3 text-left transition-all hover:bg-gray-700'
              >
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 transition-colors group-hover:bg-red-500/20'>
                  <ArrowPathIcon className='h-5 w-5 text-red-500' />
                </div>
                <div>
                  <p className='text-sm font-medium'>Clear & Reload</p>
                  <p className='text-[10px] text-gray-400'>
                    Clears localStorage
                  </p>
                </div>
              </button>
            </div>
          </div>
          <div className='flex items-center justify-between bg-black/50 px-4 py-3 text-[10px] text-gray-600'>
            <span>TEA RealWorld Debug</span>
            <span className='rounded bg-gray-800 px-1.5 py-0.5'>v0.1.0</span>
          </div>
        </div>
      )}
    </div>
  )

  return createPortal(panelContent, document.body)
}
