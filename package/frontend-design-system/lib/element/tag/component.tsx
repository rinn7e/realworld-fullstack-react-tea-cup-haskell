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
  light: string
  lightHover: string
  outline: string
  outlineHover: string
}

const colorStyles: Record<TagColor, TagColorStyle> = {
  white: {
    solid:
      'bg-white text-gray-800 border border-gray-200 dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-800',
    solidHover: 'hover:bg-gray-100 dark:hover:bg-zinc-800',
    light:
      'bg-white/80 text-gray-700 border border-gray-100 dark:bg-zinc-900/80 dark:text-zinc-300 dark:border-zinc-800',
    lightHover: 'hover:bg-gray-100 hover:text-gray-900',
    outline:
      'border border-gray-300 bg-transparent text-gray-700 dark:border-zinc-700 dark:text-zinc-200',
    outlineHover: 'hover:border-gray-500 hover:text-gray-900',
  },
  green: {
    solid: 'bg-green-600 text-white',
    solidHover: 'hover:bg-green-700',
    light: 'bg-green-50 text-green-700',
    lightHover: 'hover:bg-green-100 hover:text-green-800',
    outline: 'border border-green-600 bg-transparent text-green-600',
    outlineHover: 'hover:border-green-700 hover:text-green-700',
  },
  'dark-green': {
    solid: 'bg-green-800 text-white',
    solidHover: 'hover:bg-green-900',
    light: 'bg-green-50 text-green-800',
    lightHover: 'hover:bg-green-100 hover:text-green-900',
    outline: 'border border-green-800 bg-transparent text-green-800',
    outlineHover: 'hover:border-green-900 hover:text-green-900',
  },
  sky: {
    solid: 'bg-sky-500 text-white',
    solidHover: 'hover:bg-sky-600',
    light: 'bg-sky-50 text-sky-700',
    lightHover: 'hover:bg-sky-100 hover:text-sky-800',
    outline: 'border border-sky-500 bg-transparent text-sky-600',
    outlineHover: 'hover:border-sky-600 hover:text-sky-700',
  },
  amber: {
    solid: 'bg-amber-500 text-white',
    solidHover: 'hover:bg-amber-600',
    light: 'bg-amber-50 text-amber-800',
    lightHover: 'hover:bg-amber-100 hover:text-amber-900',
    outline: 'border border-amber-500 bg-transparent text-amber-700',
    outlineHover: 'hover:border-amber-600 hover:text-amber-800',
  },
  red: {
    solid: 'bg-red-600 text-white',
    solidHover: 'hover:bg-red-700',
    light: 'bg-red-50 text-red-700',
    lightHover: 'hover:bg-red-100 hover:text-red-800',
    outline: 'border border-red-600 bg-transparent text-red-600',
    outlineHover: 'hover:border-red-700 hover:text-red-700',
  },
  gray: {
    solid: 'bg-gray-200 text-gray-700',
    solidHover: 'hover:bg-gray-300',
    light: 'bg-gray-100 text-gray-600',
    lightHover: 'hover:bg-gray-200 hover:text-gray-800',
    outline: 'border border-gray-400 bg-transparent text-gray-600',
    outlineHover: 'hover:border-gray-600 hover:text-gray-800',
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
  if (variant === 'light') return c.light
  return c.solid
}

const getHoverClass = (c: TagColorStyle, variant: TagVariant): string => {
  if (variant === 'outline') return c.outlineHover
  if (variant === 'light') return c.lightHover
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
  key,
  dataTest,
  className,
}) => {
  const c = colorStyles[color] ?? colorStyles.gray
  const styleClass = getStyleClass(c, variant)
  const hoverClass = onClick ? getHoverClass(c, variant) : ''

  return (
    <span
      key={key}
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
