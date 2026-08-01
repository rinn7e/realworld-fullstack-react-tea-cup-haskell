import React, { useEffect, useState } from 'react'

export interface ImageProps {
  src?: string | null
  defaultSrc: string
  className?: string
  alt?: string
}

export const Image: React.FC<ImageProps> = ({
  src,
  defaultSrc,
  className,
  alt = '',
}) => {
  const [currentSrc, setCurrentSrc] = useState(src || defaultSrc)

  useEffect(() => {
    setCurrentSrc(src || defaultSrc)
  }, [src, defaultSrc])

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
