import * as EqClass from 'fp-ts/lib/Eq'
import * as boolean from 'fp-ts/lib/boolean'
import * as string from 'fp-ts/lib/string'
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
  dataTest?: string
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void
}

export const ImagePropsEq: EqClass.Eq<ImageProps> = EqClass.struct<
  Required<ImageProps>
>({
  src: EqClass.eqStrict,
  defaultSrc: string.Eq,
  fallbackSrc: string.Eq,
  alt: string.Eq,
  ratio: string.Eq,
  size: EqClass.eqStrict,
  isRounded: boolean.Eq,
  className: string.Eq,
  dataTest: string.Eq,
  onError: EqClass.eqStrict,
}) as unknown as EqClass.Eq<ImageProps>
