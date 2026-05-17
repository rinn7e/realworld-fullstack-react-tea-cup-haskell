import React from 'react'

import { type ColorScheme } from '@/theme/util'

export const BrowserInfoSection: React.FC<{
  themeName: string
  colorScheme: ColorScheme
}> = ({ themeName, colorScheme }) => {
  const [info, setInfo] = React.useState({
    browser: 'Loading...',
    os: 'Loading...',
    resolution: 'Loading...',
  })

  React.useEffect(() => {
    const ua = navigator.userAgent
    let browser = 'Unknown'
    if (ua.indexOf('Firefox') > -1) browser = 'Firefox'
    else if (ua.indexOf('SamsungBrowser') > -1) browser = 'Samsung Browser'
    else if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1)
      browser = 'Opera'
    else if (ua.indexOf('Trident') > -1) browser = 'Internet Explorer'
    else if (ua.indexOf('Edge') > -1) browser = 'Edge'
    else if (ua.indexOf('Chrome') > -1) browser = 'Chrome'
    else if (ua.indexOf('Safari') > -1) browser = 'Safari'

    let os = 'Unknown'
    if (ua.indexOf('Win') != -1) os = 'Windows'
    else if (ua.indexOf('Mac') != -1) os = 'MacOS'
    else if (ua.indexOf('Linux') != -1) os = 'Linux'
    else if (ua.indexOf('Android') != -1) os = 'Android'
    else if (ua.indexOf('like Mac') != -1) os = 'iOS'

    setInfo({
      browser,
      os,
      resolution: `${window.screen.width}x${window.screen.height}`,
    })
  }, [])

  return (
    <div className='border-theme-primary/10 bg-theme-secondary/30 mb-[24px] grid grid-cols-2 gap-[8px] rounded-[8px] border p-[12px]'>
      <div className='flex flex-col'>
        <span className='text-theme-primary text-[9px] font-black tracking-widest uppercase'>
          Browser
        </span>
        <span className='font-mono text-[11px] text-white'>{info.browser}</span>
      </div>
      <div className='flex flex-col'>
        <span className='text-theme-primary text-[9px] font-black tracking-widest uppercase'>
          Operating System
        </span>
        <span className='font-mono text-[11px] text-white'>{info.os}</span>
      </div>
      <div className='mt-[4px] flex flex-col'>
        <span className='text-theme-primary text-[9px] font-black tracking-widest uppercase'>
          Resolution
        </span>
        <span className='font-mono text-[11px] text-white'>
          {info.resolution}
        </span>
      </div>
      <div className='mt-[4px] flex flex-col'>
        <span className='text-theme-primary text-[9px] font-black tracking-widest uppercase'>
          Status
        </span>
        <span className='font-mono text-[11px] text-green-400'>Connected</span>
      </div>
      <div className='mt-[4px] flex flex-col'>
        <span className='text-theme-primary text-[9px] font-black tracking-widest uppercase'>
          Theme
        </span>
        <span className='font-mono text-[11px] text-white'>{themeName}</span>
      </div>
      <div className='col-span-2 mt-[4px] flex flex-col'>
        <span className='text-theme-primary text-[9px] font-black tracking-widest uppercase'>
          Color Scheme
        </span>
        <span className='font-mono text-[11px] text-white'>{colorScheme}</span>
      </div>
    </div>
  )
}
