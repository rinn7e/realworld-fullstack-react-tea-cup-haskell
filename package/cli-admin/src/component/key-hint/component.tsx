import { Box, Text } from 'ink'
import { memo } from 'react'

export type KeyHintProps = {
  hints: ReadonlyArray<readonly [key: string, label: string]>
}

// The keys a screen answers, as `key label` pairs
const KeyHintComponent = ({ hints }: KeyHintProps) => (
  <Box columnGap={2} flexWrap='wrap'>
    {hints.map(([key, label]) => (
      <Text key={key}>
        <Text color='cyan'>{key}</Text> <Text dimColor>{label}</Text>
      </Text>
    ))}
  </Box>
)

export const KeyHintMemo = memo(KeyHintComponent)
