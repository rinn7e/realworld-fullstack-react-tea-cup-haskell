import * as EqClass from 'fp-ts/lib/Eq'
import * as string from 'fp-ts/lib/string'
import React from 'react'

export type NotificationVariant =
  'default' | 'primary' | 'link' | 'info' | 'success' | 'warning' | 'danger'

export type NotificationProps = {
  children?: React.ReactNode
  variant?: NotificationVariant
  onDelete?: () => void
  className?: string
  key?: React.Key
  dataTest?: string
}

export const NotificationPropsEq: EqClass.Eq<NotificationProps> =
  EqClass.struct<Required<NotificationProps>>({
    children: EqClass.eqStrict,
    variant: string.Eq,
    onDelete: EqClass.eqStrict,
    className: string.Eq,
    key: EqClass.eqStrict,
    dataTest: string.Eq,
  }) as unknown as EqClass.Eq<NotificationProps>
