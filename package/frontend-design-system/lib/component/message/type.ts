import * as EqClass from 'fp-ts/lib/Eq'
import type React from 'react'

export type MessageColor =
  'white' | 'green' | 'dark-green' | 'sky' | 'amber' | 'red' | 'gray'

export type MessageProps = {
  header?: React.ReactNode
  children?: React.ReactNode
  color?: MessageColor
  onDelete?: () => void
  className?: string
  dataTest?: string
}

export const MessagePropsEq: EqClass.Eq<MessageProps> = EqClass.struct<
  Required<MessageProps>
>({
  header: EqClass.eqStrict,
  children: EqClass.eqStrict,
  color: EqClass.eqStrict,
  onDelete: EqClass.eqStrict,
  className: EqClass.eqStrict,
  dataTest: EqClass.eqStrict,
}) as unknown as EqClass.Eq<MessageProps>
