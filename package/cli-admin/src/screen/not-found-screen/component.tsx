import { Text } from 'ink'
import { memo } from 'react'

const NotFoundScreenComponent = () => (
  <Text color='yellow'>Nothing here: pick a screen above.</Text>
)

export const NotFoundScreenMemo = memo(NotFoundScreenComponent)
