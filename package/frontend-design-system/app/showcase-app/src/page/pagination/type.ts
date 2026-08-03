import { Pagination as DsPagination } from '@rinn7e/realworld-design-system'

export type Model = {
  showCode: boolean
  paginationModel: DsPagination.Model
}

export type Msg =
  { _tag: 'ToggleShowCode' } | { _tag: 'PaginationMsg'; subMsg: DsPagination.Msg }
