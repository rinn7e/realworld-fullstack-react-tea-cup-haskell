import * as EqClass from 'fp-ts/lib/Eq'
import * as O from 'fp-ts/lib/Option'
import * as S from 'fp-ts/lib/string'

import { type User, UserEq } from '@/common/api/type'

export type Shared = {
  user: O.Option<User>
  token: O.Option<string>
}

export const SharedEq: EqClass.Eq<Shared> = EqClass.struct({
  user: O.getEq(UserEq),
  token: O.getEq(S.Eq),
})
