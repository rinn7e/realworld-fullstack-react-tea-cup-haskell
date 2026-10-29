import * as EqClass from 'fp-ts/lib/Eq'
import * as O from 'fp-ts/lib/Option'
import { type Option } from 'fp-ts/lib/Option'
import * as S from 'fp-ts/lib/string'

import { type AuthUser, AuthUserEq } from './auth-user'

export type Shared = {
  user: Option<AuthUser>
  token: Option<string>
}

export const SharedEq: EqClass.Eq<Shared> = EqClass.struct({
  user: O.getEq(AuthUserEq),
  token: O.getEq(S.Eq),
})
