import { Box, Text } from 'ink'

import { fit } from '@/common/util'

export type Column<Item> = {
  label: string
  width: number
  value: (item: Item) => string
}

export type TableProps<Item> = {
  items: Item[]
  columns: Column<Item>[]
  cursor: number
  // The rows the terminal has room for: a longer list shows the ones
  // around the cursor
  maxRows: number
}

// The first row shown: the cursor kept in the middle, as far as the list
// allows
const windowStart = (cursor: number, length: number, rows: number): number =>
  Math.max(0, Math.min(cursor - Math.floor(rows / 2), length - rows))

// One line per item, the one under the cursor highlighted. Generic, so not
// memoized (as the web's search bar).
export const TableMemo = <Item,>({
  items,
  columns,
  cursor,
  maxRows,
}: TableProps<Item>) => {
  const rows = Math.max(1, maxRows)
  const start = windowStart(cursor, items.length, rows)
  const shown = items.slice(start, start + rows)
  return (
    <Box flexDirection='column'>
      <Text bold dimColor>
        {'  '}
        {columns.map((c) => fit(c.label, c.width)).join(' ')}
      </Text>
      {shown.map((item, i) =>
        start + i === cursor ? (
          <Text key={start + i} inverse color='cyan'>
            {'> '}
            {columns.map((c) => fit(c.value(item), c.width)).join(' ')}
          </Text>
        ) : (
          <Text key={start + i}>
            {'  '}
            {columns.map((c) => fit(c.value(item), c.width)).join(' ')}
          </Text>
        ),
      )}
      {items.length > rows ? (
        <Text dimColor>
          {'  '}
          {start + 1}-{start + shown.length} of {items.length}
        </Text>
      ) : null}
    </Box>
  )
}
