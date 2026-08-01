import type React from 'react'

export type ImageRatio = 'square' | '1by1' | '4by3' | '16by9' | 'rounded'

export type ImageProps = {
  src?: string | null
  defaultSrc?: string
  fallbackSrc?: string
  alt?: string
  ratio?: ImageRatio
  size?: number | string
  isRounded?: boolean
  className?: string
  key?: React.Key
  dataTest?: string
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void
}
