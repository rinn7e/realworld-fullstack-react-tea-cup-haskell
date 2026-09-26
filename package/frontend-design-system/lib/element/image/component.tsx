import { memo } from 'react'

import { cn } from '../../theme'
import { type ImageProps, ImagePropsEq, type ImageRatio } from './type'

const ratioStyles: Record<ImageRatio, string> = {
  square: 'aspect-square object-cover',
  '1by1': 'aspect-square object-cover',
  '4by3': 'aspect-4/3 object-cover',
  '16by9': 'aspect-video object-cover',
  rounded: 'rounded-full aspect-square object-cover',
}

const ImageComponent = ({
  src,
  defaultSrc,
  fallbackSrc,
  alt = '',
  ratio = 'square',
  isRounded,
  className,
  dataTest,
  onError,
}: ImageProps) => {
  const fallback = defaultSrc || fallbackSrc
  // The API sends `null` or `''` for a missing image
  const resolvedSrc = src || fallback

  const ratioClass = ratioStyles[ratio]

  return (
    <img
      data-component='Image'
      data-test={dataTest}
      src={resolvedSrc}
      alt={alt}
      className={cn(
        'align-middle',
        ratioClass,
        isRounded && 'rounded-full',
        className,
      )}
      onError={(e) => {
        // Swap to the fallback on the DOM node itself, so no React state is needed
        if (fallback && e.currentTarget.getAttribute('src') !== fallback) {
          e.currentTarget.src = fallback
        }
        onError?.(e)
      }}
    />
  )
}

export const ImageMemo = memo(ImageComponent, ImagePropsEq.equals)
