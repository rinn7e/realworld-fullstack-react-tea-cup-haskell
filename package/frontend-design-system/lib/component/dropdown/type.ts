import * as A from 'fp-ts/lib/Array'
import * as EqClass from 'fp-ts/lib/Eq'

export type DropdownItem = {
  id: string
  label: string
  isDivider?: boolean
}

export const DropdownItemEq: EqClass.Eq<DropdownItem> = EqClass.struct<
  Required<DropdownItem>
>({
  id: EqClass.eqString,
  label: EqClass.eqString,
  isDivider: EqClass.eqStrict,
}) as unknown as EqClass.Eq<DropdownItem>

export type Model = {
  isOpen: boolean
  selectedId: string | null
}

export const ModelEq: EqClass.Eq<Model> = EqClass.struct({
  isOpen: EqClass.eqBoolean,
  selectedId: EqClass.eqStrict,
})

export type Msg =
  { _tag: 'Toggle' } | { _tag: 'Close' } | { _tag: 'Select'; id: string }

export type DropdownProps = {
  triggerLabel: string
  items: DropdownItem[]
  model: Model
  dispatch: (msg: Msg) => void
  className?: string
  dataTest?: string
}

export const DropdownPropsEq: EqClass.Eq<DropdownProps> = EqClass.struct<
  Required<DropdownProps>
>({
  triggerLabel: EqClass.eqString,
  items: A.getEq(DropdownItemEq),
  model: ModelEq,
  dispatch: EqClass.eqStrict,
  className: EqClass.eqStrict,
  dataTest: EqClass.eqStrict,
}) as unknown as EqClass.Eq<DropdownProps>
