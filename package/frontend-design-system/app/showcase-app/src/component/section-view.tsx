import { Content } from '@rinn7e/realworld-design-system'
import React from 'react'

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
    <div data-component='SectionView' className='w-full space-y-3 text-left'>
      <h3 className='text-sm font-semibold tracking-wider text-gray-700 uppercase'>
        {title}
      </h3>
      {Content.view({
        className: boxClassName,
        children,
      })}
    </div>
  )
}
