import * as RD from '@devexperts/remote-data-ts'
import type * as Pagination from '@rinn7e/tea-cup-pagination'
import { Box, useInput, useWindowSize } from 'ink'
import { type ReactNode, useState } from 'react'
import { type Dispatcher } from 'tea-cup-fp'

import { type ApiError, type HttpError } from '@/common/api'
import { KeyHintMemo } from '@/component/key-hint/component'
import {
  ListEmptyMemo,
  ListErrorMemo,
  ListLoadingMemo,
} from '@/component/list-state/component'
import { PaginationNavMemo } from '@/component/pagination-nav/component'
import type * as SearchBar from '@/component/search-bar'
import { SearchBarMemo } from '@/component/search-bar/component'
import { type Column, TableMemo } from '@/component/table/component'

export type ListViewProps<Item, sortType> = {
  entityLabel: string
  columns: Column<Item>[]
  sortOptions: SearchBar.SearchOption<sortType>[]
  placeholder: string
  pagination: Pagination.Model<Item, HttpError<ApiError>>
  searchBar: SearchBar.Model<sortType>
  isTyping: boolean
  // The item picked, shown under the list (`null` when none is)
  detail: ReactNode
  searchDispatch: Dispatcher<SearchBar.Msg<sortType>>
  onTyping: (isTyping: boolean) => void
  onSelect: (item: Item) => void
  onClose: () => void
  onPage: (page: number) => void
}

// A list screen of the terminal: the search bar, one page of items with a
// cursor, the pages and the item picked. The cursor is where the keys are
// (like the focus of a page), not app state: the item picked is.
export const ListViewMemo = <Item, sortType>({
  entityLabel,
  columns,
  sortOptions,
  placeholder,
  pagination,
  searchBar,
  isTyping,
  detail,
  searchDispatch,
  onTyping,
  onSelect,
  onClose,
  onPage,
}: ListViewProps<Item, sortType>) => {
  const [cursor, setCursor] = useState(0)
  const { rows } = useWindowSize()
  // What the screen shows besides the rows: the tabs, the search bar, the
  // pages and the key hints, and the item picked when there is one
  const maxRows = rows - 16 - (detail === null ? 0 : 12)
  const items = RD.isSuccess(pagination.items) ? pagination.items.value : []
  const at = Math.min(cursor, Math.max(0, items.length - 1))

  const nextSort = (): sortType => {
    const i = sortOptions.findIndex((o) => o.value === searchBar.sort)
    return sortOptions[(i + 1) % sortOptions.length].value
  }

  const changePage = (page: number) => {
    if (page >= 1 && page <= pagination.pageAmount) {
      setCursor(0)
      onPage(page)
    }
  }

  useInput(
    (input, key) => {
      if (key.upArrow || input === 'k') {
        setCursor(Math.max(0, at - 1))
      } else if (key.downArrow || input === 'j') {
        setCursor(Math.min(items.length - 1, at + 1))
      } else if (key.return && items.length > 0) {
        onSelect(items[at])
      } else if (key.escape) {
        onClose()
      } else if (key.leftArrow || input === 'h' || input === '[') {
        changePage(pagination.page - 1)
      } else if (key.rightArrow || input === 'l' || input === ']') {
        changePage(pagination.page + 1)
      } else if (input === '/') {
        onTyping(true)
      } else if (input === 's') {
        setCursor(0)
        searchDispatch({ _tag: 'ChangeSort', sort: nextSort() })
      } else if (input === 'd') {
        setCursor(0)
        searchDispatch({
          _tag: 'ChangeDirection',
          direction: searchBar.direction === 'asc' ? 'desc' : 'asc',
        })
      }
    },
    { isActive: !isTyping },
  )

  // While the search has the keys, only esc is the list's: it gives them
  // back (enter submits, in the text field)
  useInput(
    (_input, key) => {
      if (key.escape) onTyping(false)
    },
    { isActive: isTyping },
  )

  return (
    <Box flexDirection='column' rowGap={1}>
      <SearchBarMemo
        model={searchBar}
        sortOptions={sortOptions}
        placeholder={placeholder}
        isTyping={isTyping}
        dispatch={searchDispatch}
        onSubmit={() => {
          setCursor(0)
          searchDispatch({ _tag: 'Submit' })
          onTyping(false)
        }}
      />
      {RD.isSuccess(pagination.items) ? (
        items.length === 0 ? (
          <ListEmptyMemo entityLabel={entityLabel} />
        ) : (
          <TableMemo
            items={items}
            columns={columns}
            cursor={at}
            maxRows={maxRows}
          />
        )
      ) : RD.isFailure(pagination.items) ? (
        <ListErrorMemo
          entityLabel={entityLabel}
          error={pagination.items.error}
        />
      ) : (
        <ListLoadingMemo entityLabel={entityLabel} />
      )}
      <PaginationNavMemo
        currentPage={pagination.page}
        pageAmount={pagination.pageAmount}
      />
      {detail}
      <KeyHintMemo
        hints={
          isTyping
            ? [
                ['enter', 'search'],
                ['esc', 'cancel'],
              ]
            : [
                ['j/k', 'move'],
                ['enter', 'open'],
                ['h/l', 'page'],
                ['/', 'search'],
                ['s', 'sort'],
                ['d', 'direction'],
              ]
        }
      />
    </Box>
  )
}
