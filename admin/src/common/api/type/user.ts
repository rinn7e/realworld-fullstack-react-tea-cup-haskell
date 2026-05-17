import { NullableEq } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as N from 'fp-ts/lib/number'
import * as S from 'fp-ts/lib/string'
import * as t from 'io-ts'

export type User = {
  id: number
  username: string
  email: string
  bio: string | null
  image: string | null
}

export const UserEq: EqClass.Eq<User> = EqClass.struct({
  id: N.Eq,
  username: S.Eq,
  email: S.Eq,
  bio: NullableEq(S.Eq),
  image: NullableEq(S.Eq),
})

export const UserJson: t.Type<User> = t.type({
  id: t.number,
  username: t.string,
  email: t.string,
  bio: t.union([t.string, t.null]),
  image: t.union([t.string, t.null]),
})

export type AdminUser = User & {
  role: string
}

export const AdminUserEq: EqClass.Eq<AdminUser> = EqClass.struct({
  id: N.Eq,
  username: S.Eq,
  email: S.Eq,
  bio: NullableEq(S.Eq),
  image: NullableEq(S.Eq),
  role: S.Eq,
})

export const AdminUserJson: t.Type<AdminUser> = t.type({
  id: t.number,
  username: t.string,
  email: t.string,
  bio: t.union([t.string, t.null]),
  image: t.union([t.string, t.null]),
  role: t.string,
})

export type AdminUserListResponse = {
  users: AdminUser[]
  totalCount: number
}

export const AdminUserListResponseJson = t.type({
  users: t.array(AdminUserJson),
  totalCount: t.number,
})

export type LoginRequest = {
  user: {
    email: string
    password: string
  }
}

export const LoginRequestJson = t.type({
  user: t.type({
    email: t.string,
    password: t.string,
  }),
})

export type UpdateUserRoleRequest = {
  role: string
}

export const UpdateUserRoleRequestJson = t.type({
  role: t.string,
})

export type UserResponse = {
  user: {
    email: string
    token: string
    username: string
    bio: string | null
    image: string | null
  }
}

export const UserResponseJson = t.type({
  user: t.type({
    email: t.string,
    token: t.string,
    username: t.string,
    bio: t.union([t.string, t.null]),
    image: t.union([t.string, t.null]),
  }),
})
