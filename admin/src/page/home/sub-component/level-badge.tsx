import React from 'react'

import { type ErrorLog } from '../type'

export const LevelBadge: React.FC<{ level: ErrorLog['level'] }> = ({
  level,
}) => {
  const styles = {
    error: 'bg-red-50 text-red-600 border-red-100',
    warning: 'bg-amber-50 text-amber-600 border-amber-100',
    info: 'bg-blue-50 text-blue-600 border-blue-100',
  }

  return (
    <span
      className={`rounded-full border px-[8px] py-[2px] text-[11px] font-bold tracking-tight uppercase ${styles[level]}`}
    >
      {level}
    </span>
  )
}
