import { memo } from 'react'
import React from 'react'

import { cn } from '../../theme'
import { DeleteMemo } from '../delete/component'
import {
  type TagColor,
  type TagProps,
  TagPropsEq,
  type TagVariant,
} from './type'

type TagColorStyle = {
  solid: string
  solidHover: string
  outline: string
  outlineHover: string
}

const colorStyles: Record<TagColor, TagColorStyle> = {
  white: {
    solid:
      'bg-white text-gray-800 border border-gray-200 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700',
    solidHover:
      'hover:bg-gray-100 dark:hover:bg-zinc-700 dark:hover:text-white',
    outline:
      'border border-gray-300 bg-transparent text-gray-700 dark:border-zinc-600 dark:text-zinc-300',
    outlineHover:
      'hover:border-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:hover:border-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800',
  },
  green: {
    solid: 'bg-green-600 text-white dark:bg-green-600 dark:text-white',
    solidHover: 'hover:bg-green-700 dark:hover:bg-green-500',
    outline:
      'border border-green-600 bg-transparent text-green-600 dark:border-green-500 dark:text-green-400',
    outlineHover:
      'hover:border-green-700 hover:text-green-700 hover:bg-green-50 dark:hover:border-green-400 dark:hover:text-green-300 dark:hover:bg-green-950/50',
  },
  'dark-green': {
    solid:
      'bg-green-800 text-white dark:bg-emerald-900 dark:text-emerald-100 dark:border dark:border-emerald-700',
    solidHover: 'hover:bg-green-900 dark:hover:bg-emerald-800',
    outline:
      'border border-green-800 bg-transparent text-green-800 dark:border-emerald-600 dark:text-emerald-400',
    outlineHover:
      'hover:border-green-900 hover:text-green-900 hover:bg-green-100 dark:hover:border-emerald-500 dark:hover:text-emerald-300 dark:hover:bg-emerald-950/50',
  },
  sky: {
    solid: 'bg-sky-500 text-white dark:bg-sky-600 dark:text-white',
    solidHover: 'hover:bg-sky-600 dark:hover:bg-sky-500',
    outline:
      'border border-sky-500 bg-transparent text-sky-600 dark:border-sky-400 dark:text-sky-400',
    outlineHover:
      'hover:border-sky-600 hover:text-sky-700 hover:bg-sky-50 dark:hover:border-sky-300 dark:hover:text-sky-300 dark:hover:bg-sky-950/50',
  },
  amber: {
    solid: 'bg-amber-500 text-white dark:bg-amber-600 dark:text-white',
    solidHover: 'hover:bg-amber-600 dark:hover:bg-amber-500',
    outline:
      'border border-amber-500 bg-transparent text-amber-700 dark:border-amber-400 dark:text-amber-400',
    outlineHover:
      'hover:border-amber-600 hover:text-amber-800 hover:bg-amber-50 dark:hover:border-amber-300 dark:hover:text-amber-300 dark:hover:bg-amber-950/50',
  },
  red: {
    solid: 'bg-red-600 text-white dark:bg-red-600 dark:text-white',
    solidHover: 'hover:bg-red-700 dark:hover:bg-red-500',
    outline:
      'border border-red-600 bg-transparent text-red-600 dark:border-red-500 dark:text-red-400',
    outlineHover:
      'hover:border-red-700 hover:text-red-700 hover:bg-red-50 dark:hover:border-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/50',
  },
  gray: {
    solid:
      'bg-gray-200 text-gray-700 dark:bg-zinc-800 dark:text-zinc-200 dark:border dark:border-zinc-700',
    solidHover:
      'hover:bg-gray-300 dark:hover:bg-zinc-700 dark:hover:text-white',
    outline:
      'border border-gray-400 bg-transparent text-gray-600 dark:border-zinc-600 dark:text-zinc-400',
    outlineHover:
      'hover:border-gray-600 hover:text-gray-800 hover:bg-gray-100 dark:hover:border-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800',
  },
}

const sizeStyles: Record<string, string> = {
  small: 'px-2 py-0.5 text-[11px] leading-none',
  normal: 'px-2.5 py-0.5 text-xs',
  medium: 'px-3 py-1 text-sm',
  large: 'px-3.5 py-1.5 text-base',
}

const getStyleClass = (c: TagColorStyle, variant: TagVariant): string => {
  if (variant === 'outline') return c.outline
  return c.solid
}

const getHoverClass = (c: TagColorStyle, variant: TagVariant): string => {
  if (variant === 'outline') return c.outlineHover
  return c.solidHover
}

export const TagComponent: React.FC<TagProps> = ({
  color = 'gray',
  variant = 'solid',
  size = 'normal',
  isRounded = true,
  children,
  onDelete,
  onClick,
  dataTest,
  className,
}) => {
  const c = colorStyles[color] ?? colorStyles.gray
  const styleClass = getStyleClass(c, variant)
  const hoverClass = onClick ? getHoverClass(c, variant) : ''

  return (
    <span
      data-component='Tag'
      data-test={dataTest}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 align-middle transition-all select-none',
        onClick && 'cursor-pointer',
        styleClass,
        hoverClass,
        sizeStyles[size],
        isRounded ? 'rounded-full' : 'rounded',
        className,
      )}
    >
      <span>{children}</span>
      {onDelete && <DeleteMemo size='small' onClick={onDelete} />}
    </span>
  )
}

export const TagMemo = memo(TagComponent, TagPropsEq.equals)
