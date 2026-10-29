import { NullableEq } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as B from 'fp-ts/lib/boolean'
import * as S from 'fp-ts/lib/string'
import * as t from 'io-ts'

export type Profile = {
  username: string
  bio: string | null
  image: string | null
  following: boolean
}

export const ProfileEq = EqClass.struct<Profile>({
  username: S.Eq,
  bio: NullableEq(S.Eq),
  image: NullableEq(S.Eq),
  following: B.Eq,
})

export const ProfileJson: t.Type<Profile> = t.type({
  username: t.string,
  bio: t.union([t.string, t.null]),
  image: t.union([t.string, t.null]),
  following: t.boolean,
})
