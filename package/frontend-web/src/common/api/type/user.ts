import { NullableEq } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as S from 'fp-ts/lib/string'
import * as t from 'io-ts'

export type User = {
  email: string
  username: string
  bio: string | null
  image: string | null
}

export type UserWithToken = User & { token: string }

export const UserEq: EqClass.Eq<User> = EqClass.struct({
  email: S.Eq,
  username: S.Eq,
  bio: NullableEq(S.Eq),
  image: NullableEq(S.Eq),
})

export const UserWithTokenEq: EqClass.Eq<UserWithToken> = EqClass.struct({
  email: S.Eq,
  token: S.Eq,
  username: S.Eq,
  bio: NullableEq(S.Eq),
  image: NullableEq(S.Eq),
})

export const UserWithTokenJson: t.Type<UserWithToken> = t.type({
  email: t.string,
  token: t.string,
  username: t.string,
  bio: t.union([t.string, t.null]),
  image: t.union([t.string, t.null]),
})

export type UserResponse = {
  user: UserWithToken
}

export const UserResponseJson: t.Type<UserResponse> = t.type({
  user: UserWithTokenJson,
})

export type LoginRequest = {
  user: {
    email: string
    password: string
  }
}

export type SignupRequest = {
  user: {
    username: string
    email: string
    password: string
  }
}

export type UpdateUserRequest = {
  user: {
    email?: string
    username?: string
    bio?: string
    image?: string
    password?: string
  }
}
