import { ButtonMemo as DsButtonMemo } from '@rinn7e/realworld-design-system/element/button/component'
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
}: FavButtonProps): React.ReactElement => (
  <DsButtonMemo
    color='green'
    variant={favorited ? 'solid' : 'outline'}
    size='xsmall'
    dataTest='fav-button'
    onClick={onClick}
  >
    <span className='flex items-center gap-1'>
      <Heart size={12} fill={favorited ? 'currentColor' : 'none'} />
      <span>{favoritesCount}</span>
    </span>
  </DsButtonMemo>
)

const detailFavButtonGreen = ({
  favorited,
  favoritesCount,
  onClick,
}: FavButtonProps): React.ReactElement => (
  <DsButtonMemo
    color='green'
    variant={favorited ? 'solid' : 'outline'}
    size='xsmall'
    dataTest='fav-button'
    onClick={onClick}
  >
    <span className='flex items-center gap-1.5'>
      <Heart size={13} fill={favorited ? 'currentColor' : 'none'} />
      <span>{favorited ? 'Unfavorite Article' : 'Favorite Article'}</span>
      <span>({favoritesCount})</span>
    </span>
  </DsButtonMemo>
)

export const favButtonView = ({
  variant = 'normal',
  ...props
}: FavButtonProps): React.ReactElement => {
  if (variant === 'detail') {
    return detailFavButtonGreen(props)
  }
  return normalFavButtonGreen(props)
}
