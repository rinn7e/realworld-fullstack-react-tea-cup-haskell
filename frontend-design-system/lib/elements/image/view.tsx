import React from 'react'
import { cn } from '../../theme'
import type { ImageProps } from './type'

const ratioStyles: Record<string, string> = {
  square: 'aspect-square object-cover',
  '1by1': 'aspect-square object-cover',
  '4by3': 'aspect-4/3 object-cover',
  '16by9': 'aspect-video object-cover',
  rounded: 'rounded-full aspect-square object-cover',
}

export const view: React.FC<ImageProps> = ({
  src,
  alt = '',
  ratio = 'square',
  className,
}) => {
  return (
    <figure className={cn('overflow-hidden rounded-lg', className)}>
      <img
        src={src}
        alt={alt}
        className={cn('w-full h-full', ratioStyles[ratio])}
      />
    </figure>
  )
}
