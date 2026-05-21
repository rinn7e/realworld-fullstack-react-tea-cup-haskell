import React, { useState, useEffect } from 'react'

export interface UserImageProps {
  src?: string | null
  className?: string
  alt?: string
}

export const DEFAULT_AVATAR_URL =
  'https://api.dicebear.com/7.x/avataaars/svg?seed=default'

export const UserImage: React.FC<UserImageProps> = ({
  src,
  className = 'h-[100px] w-[100px] rounded-[24px] border-4 border-white object-cover shadow-lg',
  alt = '',
}) => {
  const [currentSrc, setCurrentSrc] = useState(src || DEFAULT_AVATAR_URL)

  useEffect(() => {
    setCurrentSrc(src || DEFAULT_AVATAR_URL)
  }, [src])

  return (
    <img
      src={currentSrc}
      className={className}
      alt={alt}
      onError={() => setCurrentSrc(DEFAULT_AVATAR_URL)}
    />
  )
}
