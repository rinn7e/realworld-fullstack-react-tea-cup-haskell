import { ButtonMemo as DsButtonMemo } from '@rinn7e/realworld-design-system/element/button/component'
import { EqAlways } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as B from 'fp-ts/lib/boolean'
import * as N from 'fp-ts/lib/number'
import * as S from 'fp-ts/lib/string'
import { Heart } from 'lucide-react'
import { memo } from 'react'

export type FavButtonVariant = 'normal' | 'detail'

export type FavButtonProps = {
  variant: FavButtonVariant
  favorited: boolean
  favoritesCount: number
  onClick: () => void
}

const FavButtonPropsEq: EqClass.Eq<FavButtonProps> = EqClass.struct({
  variant: S.Eq,
  favorited: B.Eq,
  favoritesCount: N.Eq,
  onClick: EqAlways,
})

const FavButtonComponent = ({
  variant,
  favorited,
  favoritesCount,
  onClick,
}: FavButtonProps) => (
  <DsButtonMemo
    color='green'
    variant={favorited ? 'solid' : 'outline'}
    size='xsmall'
    dataTest='fav-button'
    onClick={onClick}
  >
    {variant === 'detail' ? (
      <span className='flex items-center gap-1.5'>
        <Heart size={13} fill={favorited ? 'currentColor' : 'none'} />
        <span>{favorited ? 'Unfavorite Article' : 'Favorite Article'}</span>
        <span>({favoritesCount})</span>
      </span>
    ) : (
      <span className='flex items-center gap-1'>
        <Heart size={12} fill={favorited ? 'currentColor' : 'none'} />
        <span>{favoritesCount}</span>
      </span>
    )}
  </DsButtonMemo>
)

export const FavButtonMemo = memo(FavButtonComponent, FavButtonPropsEq.equals)
