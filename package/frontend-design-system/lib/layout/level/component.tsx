import React, { memo } from 'react'

import { cn } from '../../theme'
import {
  LevelItemPropsEq,
  LevelPropsEq,
  type LevelItemProps,
  type LevelProps,
} from './type'

export const LevelComponent: React.FC<LevelProps> = ({
  children,
  className,
  key,
  dataTest,
}) => {
  return (
    <div
      key={key}
      data-test={dataTest}
      data-component='Level'
      className={cn(
        'flex flex-col items-center justify-between gap-4 md:flex-row',
        className,
      )}
    >
      {children()}
    </div>
  )
}

export const LevelItemComponent: React.FC<LevelItemProps> = ({
  hasTextCentered,
  children,
  className,
  key,
  dataTest,
}) => {
  return (
    <div
      key={key}
      data-test={dataTest}
      data-component='LevelItem'
      className={cn(
        'flex items-center justify-center',
        hasTextCentered && 'text-center',
        className,
      )}
    >
      {children()}
    </div>
  )
}

export const LevelMemo = memo(LevelComponent, LevelPropsEq.equals)
export const LevelItemMemo = memo(LevelItemComponent, LevelItemPropsEq.equals)
