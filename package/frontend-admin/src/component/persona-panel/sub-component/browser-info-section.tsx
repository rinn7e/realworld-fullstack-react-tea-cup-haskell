import * as EqClass from 'fp-ts/lib/Eq'
import * as S from 'fp-ts/lib/string'
import React, { memo } from 'react'

import { type ColorScheme } from '@/theme/type'

import { detectBrowser, detectOs } from '../util'

export type BrowserInfoSectionProps = {
  themeName: string
  colorScheme: ColorScheme
}

const BrowserInfoSectionPropsEq: EqClass.Eq<BrowserInfoSectionProps> =
  EqClass.struct({
    themeName: S.Eq,
    colorScheme: S.Eq,
  })

const BrowserInfoSectionComponent = ({
  themeName,
  colorScheme,
}: BrowserInfoSectionProps) => {
  const [info, setInfo] = React.useState({
    browser: 'Loading...',
    os: 'Loading...',
    resolution: 'Loading...',
  })

  React.useEffect(() => {
    setInfo({
      browser: detectBrowser(navigator.userAgent),
      os: detectOs(navigator.userAgent),
      resolution: `${window.screen.width}x${window.screen.height}`,
    })
  }, [])

  return (
    <div className='pb-[24px]'>
      <div className='border-theme-primary/10 bg-theme-secondary/30 grid grid-cols-2 gap-[8px] rounded-[8px] border p-[12px]'>
        <div className='flex flex-col'>
          <span className='text-theme-primary text-[9px] font-black tracking-widest uppercase'>
            Browser
          </span>
          <span className='font-mono text-[11px] text-white'>
            {info.browser}
          </span>
        </div>
        <div className='flex flex-col'>
          <span className='text-theme-primary text-[9px] font-black tracking-widest uppercase'>
            Operating System
          </span>
          <span className='font-mono text-[11px] text-white'>{info.os}</span>
        </div>
        <div className='flex flex-col pt-[4px]'>
          <span className='text-theme-primary text-[9px] font-black tracking-widest uppercase'>
            Resolution
          </span>
          <span className='font-mono text-[11px] text-white'>
            {info.resolution}
          </span>
        </div>
        <div className='flex flex-col pt-[4px]'>
          <span className='text-theme-primary text-[9px] font-black tracking-widest uppercase'>
            Status
          </span>
          <span className='font-mono text-[11px] text-green-400'>
            Connected
          </span>
        </div>
        <div className='flex flex-col pt-[4px]'>
          <span className='text-theme-primary text-[9px] font-black tracking-widest uppercase'>
            Theme
          </span>
          <span className='font-mono text-[11px] text-white'>{themeName}</span>
        </div>
        <div className='col-span-2 flex flex-col pt-[4px]'>
          <span className='text-theme-primary text-[9px] font-black tracking-widest uppercase'>
            Color Scheme
          </span>
          <span className='font-mono text-[11px] text-white'>
            {colorScheme}
          </span>
        </div>
      </div>
    </div>
  )
}

export const BrowserInfoSectionMemo = memo(
  BrowserInfoSectionComponent,
  BrowserInfoSectionPropsEq.equals,
)
