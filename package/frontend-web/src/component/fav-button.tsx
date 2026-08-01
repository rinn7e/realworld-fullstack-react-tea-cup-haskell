import { Button } from '@rinn7e/realworld-design-system'
import { Heart } from 'lucide-react'
import React from 'react'

type FavButtonProps = {
  favorited: boolean
  favoritesCount: number
  onClick: () => void
  isLight?: boolean
  variant?: 'normal' | 'detail'
}

const normalFavButtonGreen = ({
  favorited,
  favoritesCount,
  onClick,
}: FavButtonProps): React.ReactElement =>
  Button.view({
    color: 'green',
    variant: favorited ? 'solid' : 'outline',
    size: 'xsmall',
    dataTest: 'fav-button',
    onClick,
    children: () => (
      <span className='flex items-center gap-1'>
        <Heart size={12} fill={favorited ? 'currentColor' : 'none'} />
        <span>{favoritesCount}</span>
      </span>
    ),
  })

const detailFavButtonGreen = ({
  favorited,
  favoritesCount,
  onClick,
}: FavButtonProps): React.ReactElement =>
  Button.view({
    color: 'green',
    variant: favorited ? 'solid' : 'outline',
    size: 'xsmall',
    dataTest: 'fav-button',
    onClick,
    children: () => (
      <span className='flex items-center gap-1.5'>
        <Heart size={13} fill={favorited ? 'currentColor' : 'none'} />
        <span>{favorited ? 'Unfavorite Article' : 'Favorite Article'}</span>
        <span>({favoritesCount})</span>
      </span>
    ),
  })

export const favButtonView = ({
  variant = 'normal',
  ...props
}: FavButtonProps): React.ReactElement => {
  if (variant === 'detail') {
    return detailFavButtonGreen(props)
  }
  return normalFavButtonGreen(props)
}
