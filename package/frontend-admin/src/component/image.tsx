import { NullableEq } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as S from 'fp-ts/lib/string'
import { memo, useEffect, useState } from 'react'

export type ImageProps = {
  src: string | null
  defaultSrc: string
  className: string
  alt: string
}

const ImagePropsEq: EqClass.Eq<ImageProps> = EqClass.struct({
  src: NullableEq(S.Eq),
  defaultSrc: S.Eq,
  className: S.Eq,
  alt: S.Eq,
})

const ImageComponent = ({ src, defaultSrc, className, alt }: ImageProps) => {
  // The API sends `null` or `''` for users without an avatar
  const resolvedSrc = src === null || src === '' ? defaultSrc : src
  const [currentSrc, setCurrentSrc] = useState(resolvedSrc)

  useEffect(() => {
    setCurrentSrc(resolvedSrc)
  }, [resolvedSrc])

  return (
    <img
      src={currentSrc}
      className={className}
      alt={alt}
      onError={() => {
        if (currentSrc !== defaultSrc) {
          setCurrentSrc(defaultSrc)
        }
      }}
    />
  )
}

export const ImageMemo = memo(ImageComponent, ImagePropsEq.equals)
