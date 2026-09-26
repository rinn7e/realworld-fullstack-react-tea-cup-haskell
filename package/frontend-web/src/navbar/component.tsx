import { ImageMemo as DsImageMemo } from '@rinn7e/realworld-design-system/element/image/component'
import * as EqClass from 'fp-ts/lib/Eq'
import * as O from 'fp-ts/lib/Option'
import type { Option } from 'fp-ts/lib/Option'
import * as N from 'fp-ts/lib/number'
import * as S from 'fp-ts/lib/string'
import { Monitor, Moon, Pencil, Settings, Sun } from 'lucide-react'
import { memo } from 'react'

import { type User, UserEq } from '@/common/api'
import type { ColorScheme } from '@/theme/type'

import type { NavLinkIcon } from './type'

export type ColorSchemeIconProps = {
  scheme: ColorScheme
  size: number
}

const ColorSchemeIconPropsEq: EqClass.Eq<ColorSchemeIconProps> = EqClass.struct(
  {
    scheme: S.Eq,
    size: N.Eq,
  },
)

const ColorSchemeIconComponent = ({ scheme, size }: ColorSchemeIconProps) => {
  switch (scheme) {
    case 'light':
      return <Sun size={size} className='text-amber-500' />
    case 'dark':
      return (
        <Moon size={size} className='text-purple-600 dark:text-purple-400' />
      )
    case 'auto':
      return <Monitor size={size} className='text-emerald-500' />
  }
}

export const ColorSchemeIconMemo = memo(
  ColorSchemeIconComponent,
  ColorSchemeIconPropsEq.equals,
)

export type NavLinkIconProps = {
  icon: NavLinkIcon
  user: Option<User>
}

// `Avatar.getImage` is a pure function of `user`, so comparing the icon's tag is enough
const NavLinkIconPropsEq: EqClass.Eq<NavLinkIconProps> = EqClass.struct({
  icon: EqClass.contramap((icon: NavLinkIcon) =>
    icon._tag === 'Icon' ? icon.name : icon._tag,
  )(S.Eq),
  user: O.getEq(UserEq),
})

const NavLinkIconComponent = ({ icon, user }: NavLinkIconProps) => {
  switch (icon._tag) {
    case 'Icon':
      return icon.name === 'pencil' ? (
        <Pencil size={14} />
      ) : (
        <Settings size={14} />
      )
    case 'Avatar':
      return (
        <DsImageMemo
          src={icon.getImage(user)}
          defaultSrc='/default-avatar.svg'
          className='h-[28px] w-[28px] rounded-full object-cover'
          alt=''
          dataTest='navbar-user-avatar'
        />
      )
  }
}

export const NavLinkIconMemo = memo(
  NavLinkIconComponent,
  NavLinkIconPropsEq.equals,
)
