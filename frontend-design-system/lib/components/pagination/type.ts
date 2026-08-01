export type Model = {
  currentPage: number
  totalPages: number
}

export type Msg = { _tag: 'SetPage'; page: number }

export type PaginationProps = {
  model: Model
  dispatch: (msg: Msg) => void
  onPageChange?: (page: number) => void
  className?: string
}
