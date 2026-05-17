import React from 'react'

export const FilterButton: React.FC<{
  label: string
  active: boolean
  onClick: () => void
}> = ({ label, active, onClick }) => (
  <button
    type='button'
    onClick={onClick}
    className={`rounded-[6px] px-[12px] py-[6px] text-[13px] font-medium transition-all ${
      active
        ? 'dark:bg-surface-dark text-theme-primary bg-white shadow-sm'
        : 'text-slate-500 hover:text-slate-700 dark:text-slate-200 dark:hover:text-slate-200'
    }`}
  >
    {label}
  </button>
)
