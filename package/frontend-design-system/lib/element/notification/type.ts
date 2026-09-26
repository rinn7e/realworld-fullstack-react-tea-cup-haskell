import { UndefinableEq } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as string from 'fp-ts/lib/string'
import React from 'react'

export type NotificationColor =
  'white' | 'green' | 'dark-green' | 'sky' | 'amber' | 'red' | 'gray'

export type NotificationProps = {
  children?: React.ReactNode
  color?: NotificationColor
  onDelete?: () => void
  className?: string
  dataTest?: string
}

export const NotificationPropsEq: EqClass.Eq<NotificationProps> =
  EqClass.struct<NotificationProps>({
    children: EqClass.eqStrict,
    color: UndefinableEq(string.Eq),
    onDelete: EqClass.eqStrict,
    className: UndefinableEq(string.Eq),
    dataTest: UndefinableEq(string.Eq),
  })
