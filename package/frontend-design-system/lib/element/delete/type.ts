import React from 'react'
import * as EqClass from 'fp-ts/lib/Eq'
import * as string from 'fp-ts/lib/string'

export type DeleteSize = 'small' | 'normal' | 'medium' | 'large'

export type DeleteProps = {
  size?: DeleteSize
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
  key?: React.Key
  dataTest?: string
}

export const DeletePropsEq: EqClass.Eq<DeleteProps> = EqClass.struct<Required<DeleteProps>>({
  size: string.Eq,
  onClick: EqClass.eqStrict,
  className: string.Eq,
  key: EqClass.eqStrict,
  dataTest: string.Eq,
}) as unknown as EqClass.Eq<DeleteProps>
