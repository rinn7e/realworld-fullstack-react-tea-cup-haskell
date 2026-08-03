import { memo } from 'react'
import React from 'react'

import { cn } from '../../theme'
import { type TitleProps, TitlePropsEq } from './type'

const sizeStyles: Record<number, { title: string; subtitle: string }> = {
  1: {
    title: 'text-4xl font-extrabold sm:text-5xl',
    subtitle: 'text-2xl text-gray-500 font-normal',
  },
  2: {
    title: 'text-3xl font-extrabold sm:text-4xl',
    subtitle: 'text-xl text-gray-500 font-normal',
  },
  3: {
    title: 'text-2xl font-bold sm:text-3xl',
    subtitle: 'text-lg text-gray-500 font-normal',
  },
  4: {
    title: 'text-xl font-bold',
    subtitle: 'text-base text-gray-500 font-normal',
  },
  5: {
    title: 'text-lg font-semibold',
    subtitle: 'text-sm text-gray-500 font-normal',
  },
  6: {
    title: 'text-base font-semibold',
    subtitle: 'text-xs text-gray-500 font-normal',
  },
}

export const TitleComponent: React.FC<TitleProps> = ({
  children,
  size = 3,
  isSubtitle = false,
  className,
  key,
  dataTest,
}) => {
  const styles = sizeStyles[size] || sizeStyles[3]
  const fullClass = cn(
    'tracking-tight text-gray-900',
    isSubtitle ? styles.subtitle : styles.title,
    className,
  )

  switch (size) {
    case 1:
      return (
        <h1 key={key} data-test={dataTest} data-component='Title' className={fullClass}>
          {children}
        </h1>
      )
    case 2:
      return (
        <h2 key={key} data-test={dataTest} data-component='Title' className={fullClass}>
          {children}
        </h2>
      )
    case 3:
      return (
        <h3 key={key} data-test={dataTest} data-component='Title' className={fullClass}>
          {children}
        </h3>
      )
    case 4:
      return (
        <h4 key={key} data-test={dataTest} data-component='Title' className={fullClass}>
          {children}
        </h4>
      )
    case 5:
      return (
        <h5 key={key} data-test={dataTest} data-component='Title' className={fullClass}>
          {children}
        </h5>
      )
    case 6:
      return (
        <h6 key={key} data-test={dataTest} data-component='Title' className={fullClass}>
          {children}
        </h6>
      )
    default:
      return (
        <h3 key={key} data-test={dataTest} data-component='Title' className={fullClass}>
          {children}
        </h3>
      )
  }
}

export const TitleMemo = memo(TitleComponent, TitlePropsEq.equals)
