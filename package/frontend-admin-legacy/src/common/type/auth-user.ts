import { NullableEq } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as S from 'fp-ts/lib/string'

export type AuthUser = {
  username: string
  email: string
  token: string
  bio: string | null
  image: string | null
}

export const AuthUserEq: EqClass.Eq<AuthUser> = EqClass.struct({
  username: S.Eq,
  email: S.Eq,
  token: S.Eq,
  bio: NullableEq(S.Eq),
  image: NullableEq(S.Eq),
})
