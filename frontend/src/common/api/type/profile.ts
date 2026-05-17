import { NullableEq, UndefinableEq } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as B from 'fp-ts/lib/boolean'
import * as S from 'fp-ts/lib/string'
import * as t from 'io-ts'

export type Profile = {
  username: string
  bio?: string | null
  image: string | null
  following: boolean
}

export const ProfileEq = EqClass.struct<Profile>({
  username: S.Eq,
  bio: UndefinableEq(NullableEq(S.Eq)),
  image: NullableEq(S.Eq),
  following: B.Eq,
})

export const ProfileResponseEq = EqClass.struct<ProfileResponse>({
  profile: ProfileEq,
})

export const ProfileJson: t.Type<Profile> = t.intersection([
  t.type({
    username: t.string,
    image: t.union([t.string, t.null]),
    following: t.boolean,
  }),
  t.partial({
    bio: t.union([t.string, t.null]),
  }),
])

export type ProfileResponse = {
  profile: Profile
}

export const ProfileResponseJson: t.Type<ProfileResponse> = t.type({
  profile: ProfileJson,
})
