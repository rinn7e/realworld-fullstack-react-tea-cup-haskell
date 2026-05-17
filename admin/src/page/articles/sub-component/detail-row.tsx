import React from 'react'

export const DetailRow: React.FC<{
  label: string
  value: string
  mono?: boolean
}> = ({ label, value, mono }) => (
  <div className='mb-[24px]'>
    <div className='mb-[4px] text-[12px] font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-200'>
      {label}
    </div>
    <div
      className={`text-[16px] text-slate-800 dark:text-white ${mono ? 'font-mono' : ''}`}
    >
      {value}
    </div>
  </div>
)
