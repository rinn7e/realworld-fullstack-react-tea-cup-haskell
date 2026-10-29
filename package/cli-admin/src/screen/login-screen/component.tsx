import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { Box, Text, useInput } from 'ink'
import TextInput from 'ink-text-input'
import { memo, useState } from 'react'

import { KeyHintMemo } from '@/component/key-hint/component'
import { type Props } from '@/screen/login-screen'

type Field = 'email' | 'password'

// The login form. The field with the keys is where the cursor is (like the
// focus of a page), not app state.
const LoginScreenComponent = ({ model, dispatch }: Props) => {
  const [field, setField] = useState<Field>('email')
  const other = (f: Field): Field => (f === 'email' ? 'password' : 'email')

  useInput((_input, key) => {
    if (key.tab || key.upArrow || key.downArrow) setField(other(field))
  })

  const submit = () =>
    field === 'email' && model.password === ''
      ? setField('password')
      : dispatch({ _tag: 'Submit' })

  return (
    <Box flexDirection='column' rowGap={1}>
      <Text bold>Sign in to Sentinel</Text>
      <Box flexDirection='column'>
        <Box>
          <Box width={10}>
            <Text color={field === 'email' ? 'cyan' : undefined}>Email</Text>
          </Box>
          <TextInput
            value={model.email}
            placeholder='admin@realworld.io'
            focus={field === 'email' && !model.isSubmitting}
            onChange={(value) => dispatch({ _tag: 'ChangeEmail', value })}
            onSubmit={submit}
          />
        </Box>
        <Box>
          <Box width={10}>
            <Text color={field === 'password' ? 'cyan' : undefined}>
              Password
            </Text>
          </Box>
          <TextInput
            value={model.password}
            mask='*'
            focus={field === 'password' && !model.isSubmitting}
            onChange={(value) => dispatch({ _tag: 'ChangePassword', value })}
            onSubmit={submit}
          />
        </Box>
      </Box>
      {model.isSubmitting ? <Text dimColor>Signing in...</Text> : null}
      {pipe(
        model.error,
        O.fold(
          () => null,
          (error) => <Text color='red'>{error}</Text>,
        ),
      )}
      <KeyHintMemo
        hints={[
          ['tab', 'next field'],
          ['enter', 'sign in'],
          ['ctrl+c', 'quit'],
        ]}
      />
    </Box>
  )
}

export const LoginScreenMemo = memo(LoginScreenComponent)
