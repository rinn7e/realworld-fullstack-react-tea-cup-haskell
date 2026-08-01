import React, { useEffect, useState } from 'react'

export interface ImageProps {
  src?: string | null
  defaultSrc: string
  className?: string
  alt?: string
  'data-test'?: string
}

export const Image: React.FC<ImageProps> = ({
  src,
  defaultSrc,
  className,
  alt = '',
  'data-test': dataTest,
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
      data-test={dataTest}
      onError={() => {
        if (currentSrc !== defaultSrc) {
          setCurrentSrc(defaultSrc)
        }
      }}
    />
  )
}
