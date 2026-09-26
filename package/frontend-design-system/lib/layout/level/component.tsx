import { memo } from 'react'

import { cn } from '../../theme'
import {
  type LevelItemProps,
  LevelItemPropsEq,
  type LevelProps,
  LevelPropsEq,
} from './type'

const LevelComponent = ({ children, className, dataTest }: LevelProps) => {
  return (
    <div
      data-test={dataTest}
      data-component='Level'
      className={cn(
        'flex flex-col items-center justify-between gap-4 lg:flex-row',
        className,
      )}
    >
      {children}
    </div>
  )
}

const LevelItemComponent = ({
  hasTextCentered,
  children,
  className,
  dataTest,
}: LevelItemProps) => {
  return (
    <div
      data-test={dataTest}
      data-component='LevelItem'
      className={cn(
        'flex items-center justify-center',
        hasTextCentered && 'text-center',
        className,
      )}
    >
      {children}
    </div>
  )
}

export const LevelMemo = memo(LevelComponent, LevelPropsEq.equals)
export const LevelItemMemo = memo(LevelItemComponent, LevelItemPropsEq.equals)
