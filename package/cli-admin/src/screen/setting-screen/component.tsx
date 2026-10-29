import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { Box, Text, useInput } from 'ink'
import { memo } from 'react'

import { type Shared } from '@core/common/type/shared'

import { API_BASE, TOKEN_FILE } from '@/common/env'
import { KeyHintMemo } from '@/component/key-hint/component'

export type SettingScreenProps = {
  shared: Shared
  onLogout: () => void
}

// The session and where the terminal keeps it. The web's theme settings
// have no place here: the terminal has its own colors.
const SettingScreenComponent = ({ shared, onLogout }: SettingScreenProps) => {
  useInput((input) => {
    if (input === 'o') onLogout()
  })

  return (
    <Box flexDirection='column' rowGap={1}>
      <Box flexDirection='column'>
        {pipe(
          shared.user,
          O.fold(
            () => <Text dimColor>Server unavailable: signed in offline.</Text>,
            (user) => (
              <Text>
                Signed in as <Text bold>{user.username}</Text> ({user.email})
              </Text>
            ),
          ),
        )}
        <Text dimColor>API: {API_BASE}</Text>
        <Text dimColor>Token file: {TOKEN_FILE}</Text>
      </Box>
      <KeyHintMemo hints={[['o', 'log out']]} />
    </Box>
  )
}

export const SettingScreenMemo = memo(SettingScreenComponent)
