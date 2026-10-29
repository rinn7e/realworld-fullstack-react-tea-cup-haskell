import { Box, Text } from 'ink'
import TextInput from 'ink-text-input'
import { type Dispatcher } from 'tea-cup-fp'

import type * as SearchBar from '@/component/search-bar'

export type SearchBarProps<sortType> = {
  model: SearchBar.Model<sortType>
  sortOptions: SearchBar.SearchOption<sortType>[]
  placeholder: string
  isTyping: boolean
  dispatch: Dispatcher<SearchBar.Msg<sortType>>
  onSubmit: () => void
}

// The search text (a text field while it has the keys) and the sort.
// Generic, so not memoized (as on the web).
export const SearchBarMemo = <sortType,>({
  model,
  sortOptions,
  placeholder,
  isTyping,
  dispatch,
  onSubmit,
}: SearchBarProps<sortType>) => (
  <Box columnGap={3}>
    <Box>
      <Text color={isTyping ? 'cyan' : undefined}>Search: </Text>
      {isTyping ? (
        <TextInput
          value={model.searchText}
          placeholder={placeholder}
          onChange={(text) => dispatch({ _tag: 'ChangeSearchText', text })}
          onSubmit={onSubmit}
        />
      ) : (
        <Text dimColor={model.searchText === ''}>
          {model.searchText === '' ? placeholder : model.searchText}
        </Text>
      )}
    </Box>
    <Text>
      <Text dimColor>Sort: </Text>
      {sortOptions.find((o) => o.value === model.sort)?.label ?? ''}{' '}
      {model.direction === 'asc' ? '↑' : '↓'}
    </Text>
  </Box>
)
