import * as EqClass from 'fp-ts/Eq'
import * as string from 'fp-ts/string'

export interface DotLoadingProps {
  className?: string
  dataTest?: string
}

export const DotLoadingPropsEq: EqClass.Eq<DotLoadingProps> = EqClass.struct<
  Required<DotLoadingProps>
>({
  className: string.Eq,
  dataTest: string.Eq,
}) as unknown as EqClass.Eq<DotLoadingProps>
