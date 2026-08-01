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

export const view = ({
  src,
  alt,
  ratio = 'square',
  className,
  key,
  dataTest,
}: ImageProps): React.ReactElement => {
  const imageAlt = alt || ''
  return (
    <figure
      key={key}
      data-test={dataTest}
      data-component='Image'
      className={cn('overflow-hidden rounded-lg', className)}
    >
      <img
        src={src ?? undefined}
        alt={imageAlt}
        className={cn('h-full w-full', ratioStyles[ratio])}
      />
    </figure>
  )
}
