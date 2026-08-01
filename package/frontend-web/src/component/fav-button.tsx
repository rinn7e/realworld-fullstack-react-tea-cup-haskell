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

const normalFavButtonLight = ({
  favorited,
  favoritesCount,
  onClick,
}: FavButtonProps): React.ReactElement =>
  Button.view({
    variant: 'primary',
    isOutlined: !favorited,
    size: 'small',
    dataTest: 'fav-button',
    onClick,
    className: 'gap-[4px] px-[8px] py-[4px] text-xs',
    children: () => (
      <>
        <Heart size={12} fill={favorited ? 'currentColor' : 'none'} />
        <span>{favoritesCount}</span>
      </>
    ),
  })

const normalFavButtonDark = ({
  favorited,
  favoritesCount,
  onClick,
}: FavButtonProps): React.ReactElement =>
  Button.view({
    variant: 'primary',
    isOutlined: !favorited,
    size: 'small',
    dataTest: 'fav-button',
    onClick,
    className: favorited
      ? 'gap-[4px] border-green-600 bg-green-600 px-[8px] py-[4px] text-xs text-white hover:bg-green-700'
      : 'gap-[4px] border-green-400 px-[8px] py-[4px] text-xs text-green-400 hover:bg-green-900',
    children: () => (
      <>
        <Heart size={12} fill={favorited ? 'currentColor' : 'none'} />
        <span>{favoritesCount}</span>
      </>
    ),
  })

const detailFavButtonLight = ({
  favorited,
  favoritesCount,
  onClick,
}: FavButtonProps): React.ReactElement =>
  Button.view({
    variant: 'primary',
    isOutlined: !favorited,
    size: 'small',
    dataTest: 'fav-button',
    onClick,
    className: 'gap-[4px] px-[12px] py-[4px] text-xs',
    children: () => (
      <>
        <Heart size={13} fill={favorited ? 'currentColor' : 'none'} />
        <span>{favorited ? 'Unfavorite Article' : 'Favorite Article'}</span>
        <span>({favoritesCount})</span>
      </>
    ),
  })

const detailFavButtonDark = ({
  favorited,
  favoritesCount,
  onClick,
}: FavButtonProps): React.ReactElement =>
  Button.view({
    variant: 'primary',
    isOutlined: !favorited,
    size: 'small',
    dataTest: 'fav-button',
    onClick,
    className: favorited
      ? 'gap-[4px] border-green-600 bg-green-600 px-[12px] py-[4px] text-xs text-white hover:bg-green-700'
      : 'gap-[4px] border-green-400 px-[12px] py-[4px] text-xs text-green-400 hover:bg-green-900',
    children: () => (
      <>
        <Heart size={13} fill={favorited ? 'currentColor' : 'none'} />
        <span>{favorited ? 'Unfavorite Article' : 'Favorite Article'}</span>
        <span>({favoritesCount})</span>
      </>
    ),
  })

export const favButtonView = ({
  variant = 'normal',
  isLight = false,
  ...props
}: FavButtonProps): React.ReactElement => {
  if (variant === 'detail') {
    return isLight ? detailFavButtonLight(props) : detailFavButtonDark(props)
  }
  return isLight ? normalFavButtonLight(props) : normalFavButtonDark(props)
}
