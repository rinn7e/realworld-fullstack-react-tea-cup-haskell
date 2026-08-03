import { memo } from 'react'
import React, { useEffect, useState } from 'react'

import { cn } from '../../theme'
import { type ImageProps, ImagePropsEq } from './type'

const ratioStyles: Record<string, string> = {
  square: 'aspect-square object-cover',
  '1by1': 'aspect-square object-cover',
  '4by3': 'aspect-4/3 object-cover',
  '16by9': 'aspect-video object-cover',
  rounded: 'rounded-full aspect-square object-cover',
}

export const ImageComponent: React.FC<ImageProps> = ({
  src,
  defaultSrc,
  fallbackSrc,
  alt = '',
  ratio = 'square',
  isRounded,
  className,
  dataTest,
  onError,
}) => {
  const fallback = defaultSrc || fallbackSrc
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(
    src || fallback,
  )

  useEffect(() => {
    setCurrentSrc(src || fallback)
  }, [src, fallback])

  const ratioClass = ratioStyles[ratio] || ''

  return (
    <img
      data-component='Image'
      data-test={dataTest}
      src={currentSrc}
      alt={alt}
      className={cn(
        'align-middle',
        ratioClass,
        isRounded && 'rounded-full',
        className,
      )}
      onError={(e) => {
        if (fallback && currentSrc !== fallback) {
          setCurrentSrc(fallback)
        }
        onError?.(e)
      }}
    />
  )
}

export const ImageMemo = memo(ImageComponent, ImagePropsEq.equals)
