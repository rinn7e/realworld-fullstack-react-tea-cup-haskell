import React from 'react'
import { Content } from '@rinn7e/realworld-design-system'

export interface SectionViewOptions {
  title: string
  children: React.ReactNode
  boxClassName?: string
}

export const sectionView = ({
  title,
  children,
  boxClassName = 'p-6 w-full space-y-4 bg-white border-2 border-dotted border-gray-300 rounded-lg',
}: SectionViewOptions): React.ReactElement => {
  return (
    <div className='space-y-3 text-left w-full'>
      <h3 className='text-sm font-semibold text-gray-700 uppercase tracking-wider'>
        {title}
      </h3>
      {Content.view({
        className: boxClassName,
        children,
      })}
    </div>
  )
}
