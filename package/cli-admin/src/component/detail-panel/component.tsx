import { Box, Text } from 'ink'
import { memo } from 'react'

export type DetailPanelProps = {
  title: string
  rows: ReadonlyArray<readonly [label: string, value: string]>
}

// The item picked in a list, field by field (the web's detail overlay)
const DetailPanelComponent = ({ title, rows }: DetailPanelProps) => (
  <Box
    flexDirection='column'
    borderStyle='round'
    borderColor='cyan'
    paddingX={1}
  >
    <Text bold>{title}</Text>
    {rows.map(([label, value]) => (
      <Box key={label} columnGap={1}>
        <Box width={14} flexShrink={0}>
          <Text dimColor>{label}</Text>
        </Box>
        <Text>{value}</Text>
      </Box>
    ))}
    <Text dimColor>esc to close</Text>
  </Box>
)

export const DetailPanelMemo = memo(DetailPanelComponent)
