import type React from 'react'

export type ImageRatio = 'square' | '1by1' | '4by3' | '16by9' | 'rounded'

export type ImageProps = {
  src?: string | null
  alt?: string
  fallbackSrc?: string
  ratio?: ImageRatio
  size?: number | string
  className?: string
  key?: React.Key
  dataTest?: string
}
