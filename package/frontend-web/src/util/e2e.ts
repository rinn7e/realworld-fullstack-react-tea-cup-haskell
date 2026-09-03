import { getToken } from '@/common/cache'
import type { Model } from '@/type'

export interface ConduitDebug {
  getToken(): string | null
  getAuthState():
    'authenticated' | 'unauthenticated' | 'unavailable' | 'loading'
  getCurrentUser(): {
    username: string
    email: string
    bio: string | null
    image: string | null
    token: string
  } | null
}

declare global {
  interface Window {
    __conduit_debug__?: ConduitDebug
  }
}

// E2E test need this
export const assignConduitDebug = (model: Model | null) => {
  if (typeof window !== 'undefined') {
    window.__conduit_debug__ = {
      getToken: () =>
        model?.shared.token._tag === 'Some'
          ? model.shared.token.value
          : getToken(),
      getAuthState: () => {
        if (!model) return 'loading'
        if (model.unavailableMode) return 'unavailable'
        return model.shared.user._tag === 'Some'
          ? 'authenticated'
          : 'unauthenticated'
      },
      getCurrentUser: () => {
        if (
          model?.shared.user._tag === 'Some' &&
          model.shared.token._tag === 'Some'
        ) {
          return {
            ...model.shared.user.value,
            token: model.shared.token.value,
          }
        }
        return null
      },
    } satisfies ConduitDebug
  }
}
