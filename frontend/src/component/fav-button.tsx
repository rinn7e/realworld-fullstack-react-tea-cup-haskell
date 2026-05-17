import { cn } from '@rinn7e/tea-cup-prelude'
import { Heart } from 'lucide-react'
import React from 'react'

type FavButtonProps = {
  favorited: boolean
  favoritesCount: number
  onClick: () => void
  isLight?: boolean
  variant?: 'normal' | 'detail'
}

const normalFavButton = ({
  favorited,
  favoritesCount,
  onClick,
}: FavButtonProps): React.ReactElement => (
  <button
    type='button'
    onClick={onClick}
    data-test='fav-button'
    className={cn(
      'btn flex items-center gap-[4px] rounded border px-[8px] py-[4px] text-xs transition-colors',
      favorited
        ? 'border-green-600 bg-green-600 text-white hover:bg-green-700'
        : 'border-green-600 text-green-600 hover:bg-green-50',
    )}
  >
    <Heart size={12} fill={favorited ? 'currentColor' : 'none'} />
    {favoritesCount}
  </button>
)

const detailFavButton = ({
  favorited,
  favoritesCount,
  onClick,
  isLight = false,
}: FavButtonProps): React.ReactElement => (
  <button
    type='button'
    onClick={onClick}
    data-test='fav-button'
    className={cn(
      'btn flex items-center gap-[4px] rounded border px-[12px] py-[4px] text-xs transition-colors',
      favorited ? 'border-green-600' : 'border-green-600',
      isLight
        ? favorited
          ? 'bg-green-600 text-white hover:bg-green-700'
          : 'text-green-400 hover:bg-green-900'
        : favorited
          ? 'bg-green-600 text-white hover:bg-green-700'
          : 'text-green-600 hover:bg-green-50',
    )}
  >
    <Heart size={13} fill={favorited ? 'currentColor' : 'none'} />{' '}
    {favorited ? 'Unfavorite Article' : 'Favorite Article'}{' '}
    <span>({favoritesCount})</span>
  </button>
)

export const favButtonView = ({
  variant = 'normal',
  ...props
}: FavButtonProps): React.ReactElement =>
  variant === 'detail' ? detailFavButton(props) : normalFavButton(props)
