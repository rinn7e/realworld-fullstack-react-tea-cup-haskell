import { UndefinableEq } from '@rinn7e/tea-cup-prelude'
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

export const ImagePropsEq: EqClass.Eq<ImageProps> = EqClass.struct<ImageProps>({
  src: EqClass.eqStrict,
  defaultSrc: UndefinableEq(string.Eq),
  fallbackSrc: UndefinableEq(string.Eq),
  alt: UndefinableEq(string.Eq),
  ratio: UndefinableEq(string.Eq),
  size: EqClass.eqStrict,
  isRounded: UndefinableEq(boolean.Eq),
  className: UndefinableEq(string.Eq),
  dataTest: UndefinableEq(string.Eq),
  onError: EqClass.eqStrict,
})
