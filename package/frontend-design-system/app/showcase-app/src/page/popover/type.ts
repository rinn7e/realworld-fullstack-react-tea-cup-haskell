import type { Popover as DsPopover } from '@rinn7e/realworld-design-system'

export type Model = {
  showCode: boolean
  popoverLeftModel: DsPopover.Model
  popoverRightModel: DsPopover.Model
}

export type Msg =
  | { _tag: 'ToggleShowCode' }
  | { _tag: 'PopoverLeftMsg'; subMsg: DsPopover.Msg }
  | { _tag: 'PopoverRightMsg'; subMsg: DsPopover.Msg }
