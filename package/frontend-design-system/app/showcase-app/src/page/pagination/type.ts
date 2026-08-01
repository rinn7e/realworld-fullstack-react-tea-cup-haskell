import { Pagination } from '@rinn7e/realworld-design-system'

export type Model = {
  showCode: boolean
  paginationModel: Pagination.Model
}

export type Msg =
  { _tag: 'ToggleShowCode' } | { _tag: 'PaginationMsg'; subMsg: Pagination.Msg }
