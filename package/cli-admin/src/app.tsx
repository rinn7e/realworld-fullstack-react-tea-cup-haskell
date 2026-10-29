import { Box, Text, useApp, useInput } from 'ink'
import { memo } from 'react'
import { type Dispatcher } from 'tea-cup-fp'

import {
  type Screen,
  ScreenEq,
  articleScreen,
  commentScreen,
  destinationOfScreen,
  homeScreen,
  settingScreen,
  userScreen,
  visitorScreen,
} from '@core/common/type/destination'
import { currentScreenOf } from '@core/type'

import { KeyHintMemo } from '@/component/key-hint/component'
import { ArticleScreenMemo } from '@/screen/article-screen/component'
import { CommentScreenMemo } from '@/screen/comment-screen/component'
import { HomeScreenMemo } from '@/screen/home-screen/component'
import { LoginScreenMemo } from '@/screen/login-screen/component'
import { NotFoundScreenMemo } from '@/screen/not-found-screen/component'
import { SettingScreenMemo } from '@/screen/setting-screen/component'
import { UserScreenMemo } from '@/screen/user-screen/component'
import { VisitorScreenMemo } from '@/screen/visitor-screen/component'

import { type Model, type Msg } from './type'

// The tabs, in the order of the web's sidebar. Key `1` opens the first.
const tabs: ReadonlyArray<readonly [label: string, screen: Screen]> = [
  ['Overview', homeScreen()],
  ['Articles', articleScreen()],
  ['Users', userScreen()],
  ['Comments', commentScreen()],
  ['Visitors', visitorScreen()],
  ['Settings', settingScreen()],
]

export type AppProps = {
  model: Model
  dispatch: Dispatcher<Msg>
}

const AppComponent = ({ model, dispatch }: AppProps) => {
  const { exit } = useApp()
  const screen = currentScreenOf(model.screenModel)
  const isLogin = screen._tag === 'LoginScreen'
  const tabIndex = tabs.findIndex(([, s]) => ScreenEq.equals(s, screen))

  const navigate = (to: Screen) =>
    dispatch({
      _tag: 'NavigationMsg',
      subMsg: { _tag: 'Navigate', destination: destinationOfScreen(to) },
    })

  const onTyping = (isTyping: boolean) =>
    dispatch({ _tag: 'SetTyping', isTyping })

  // The app's own keys, off while a text field has them
  useInput(
    (input, key) => {
      const number = Number(input)
      if (number >= 1 && number <= tabs.length) {
        navigate(tabs[number - 1][1])
      } else if (key.tab) {
        const step = key.shift ? tabs.length - 1 : 1
        navigate(tabs[(Math.max(0, tabIndex) + step) % tabs.length][1])
      } else if (input === 'r') {
        dispatch({ _tag: 'NavigationMsg', subMsg: { _tag: 'Refresh' } })
      } else if (input === 'q') {
        exit()
      }
    },
    { isActive: !isLogin && !model.isTyping },
  )

  const screenView = () => {
    const screenModel = model.screenModel
    switch (screenModel._tag) {
      case 'LoginScreenModel':
        return (
          <LoginScreenMemo
            model={screenModel.model}
            dispatch={(subMsg) => dispatch({ _tag: 'LoginScreenMsg', subMsg })}
          />
        )
      case 'HomeScreenModel':
        return (
          <HomeScreenMemo
            model={screenModel.model}
            dispatch={(subMsg) => dispatch({ _tag: 'HomeScreenMsg', subMsg })}
          />
        )
      case 'ArticleScreenModel':
        return (
          <ArticleScreenMemo
            model={screenModel.model}
            isTyping={model.isTyping}
            dispatch={(subMsg) =>
              dispatch({ _tag: 'ArticleScreenMsg', subMsg })
            }
            onTyping={onTyping}
          />
        )
      case 'UserScreenModel':
        return (
          <UserScreenMemo
            model={screenModel.model}
            isTyping={model.isTyping}
            dispatch={(subMsg) => dispatch({ _tag: 'UserScreenMsg', subMsg })}
            onTyping={onTyping}
          />
        )
      case 'CommentScreenModel':
        return (
          <CommentScreenMemo
            model={screenModel.model}
            isTyping={model.isTyping}
            dispatch={(subMsg) =>
              dispatch({ _tag: 'CommentScreenMsg', subMsg })
            }
            onTyping={onTyping}
          />
        )
      case 'VisitorScreenModel':
        return (
          <VisitorScreenMemo
            model={screenModel.model}
            isTyping={model.isTyping}
            dispatch={(subMsg) =>
              dispatch({ _tag: 'VisitorScreenMsg', subMsg })
            }
            onTyping={onTyping}
          />
        )
      case 'SettingScreenModel':
        return (
          <SettingScreenMemo
            shared={model.shared}
            onLogout={() => dispatch({ _tag: 'Logout' })}
          />
        )
      case 'NotFoundScreenModel':
        return <NotFoundScreenMemo />
    }
  }

  return (
    <Box flexDirection='column' rowGap={1} paddingX={1}>
      <Box columnGap={1}>
        <Text bold color='cyan'>
          Sentinel
        </Text>
        {isLogin
          ? null
          : tabs.map(([label], i) => (
              <Text
                key={label}
                inverse={i === tabIndex}
                dimColor={i !== tabIndex}
              >
                {` ${i + 1} ${label} `}
              </Text>
            ))}
      </Box>
      {screenView()}
      {isLogin ? null : (
        <KeyHintMemo
          hints={[
            ['1-6', 'screen'],
            ['tab', 'next'],
            ['r', 'refresh'],
            ['q', 'quit'],
          ]}
        />
      )}
    </Box>
  )
}

export const AppMemo = memo(AppComponent)
