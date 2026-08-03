import * as EqClass from 'fp-ts/lib/Eq'
import type React from 'react'

export type MessageVariant =
  | 'default'
  | 'primary'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'

export type MessageProps = {
  header?: React.ReactNode
  children?: React.ReactNode
  variant?: MessageVariant
  onDelete?: () => void
  className?: string
  key?: React.Key
  dataTest?: string
}

export const MessagePropsEq: EqClass.Eq<MessageProps> = EqClass.struct<
  Required<MessageProps>
>({
  header: EqClass.eqStrict,
  children: EqClass.eqStrict,
  variant: EqClass.eqStrict,
  onDelete: EqClass.eqStrict,
  className: EqClass.eqStrict,
  key: EqClass.eqStrict,
  dataTest: EqClass.eqStrict,
}) as unknown as EqClass.Eq<MessageProps>
