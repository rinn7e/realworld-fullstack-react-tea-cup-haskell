import * as EqClass from 'fp-ts/lib/Eq'
import * as string from 'fp-ts/lib/string'
import React from 'react'

export type DeleteSize = 'small' | 'normal' | 'medium' | 'large'

export type DeleteProps = {
  size?: DeleteSize
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
  dataTest?: string
}

export const DeletePropsEq: EqClass.Eq<DeleteProps> = EqClass.struct<
  Required<DeleteProps>
>({
  size: string.Eq,
  onClick: EqClass.eqStrict,
  className: string.Eq,
  dataTest: string.Eq,
}) as unknown as EqClass.Eq<DeleteProps>
