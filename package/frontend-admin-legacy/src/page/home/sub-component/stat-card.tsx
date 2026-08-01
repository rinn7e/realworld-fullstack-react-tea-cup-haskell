import React from 'react'

export const StatCard: React.FC<{
  label: string
  value: string
  color: string
}> = ({ label, value, color }) => (
  <div className='dark:bg-surface-dark rounded-[12px] bg-white p-[24px] shadow-sm transition-transform hover:scale-[1.02]'>
    <div className={`mb-[12px] h-[4px] w-[40px] rounded-full ${color}`} />
    <div className='text-slate-500 dark:text-slate-200'>{label}</div>
    <div className='text-[32px] font-bold text-slate-800 dark:text-white'>
      {value}
    </div>
  </div>
)
