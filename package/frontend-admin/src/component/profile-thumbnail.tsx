import { NullableEq } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as S from 'fp-ts/lib/string'
import { memo } from 'react'

import { ImageMemo } from './image'

export const DEFAULT_AVATAR_URL =
  'https://api.dicebear.com/7.x/avataaars/svg?seed=default'

export type ProfileThumbnailProps = {
  src: string | null
  className: string
}

const ProfileThumbnailPropsEq: EqClass.Eq<ProfileThumbnailProps> =
  EqClass.struct({
    src: NullableEq(S.Eq),
    className: S.Eq,
  })

const ProfileThumbnailComponent = ({
  src,
  className,
}: ProfileThumbnailProps) => (
  <ImageMemo
    src={src}
    defaultSrc={DEFAULT_AVATAR_URL}
    className={className}
    alt=''
  />
)

export const ProfileThumbnailMemo = memo(
  ProfileThumbnailComponent,
  ProfileThumbnailPropsEq.equals,
)
