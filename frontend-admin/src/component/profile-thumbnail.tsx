import React from 'react'
import { Image } from './image'

export interface ProfileThumbnailProps {
  src?: string | null
  className?: string
  alt?: string
}

export const DEFAULT_AVATAR_URL =
  'https://api.dicebear.com/7.x/avataaars/svg?seed=default'

export const ProfileThumbnail: React.FC<ProfileThumbnailProps> = ({
  src,
  className = 'h-[100px] w-[100px] rounded-[24px] border-4 border-white object-cover shadow-lg',
  alt = '',
}) => {
  return (
    <Image
      src={src}
      defaultSrc={DEFAULT_AVATAR_URL}
      className={className}
      alt={alt}
    />
  )
}
