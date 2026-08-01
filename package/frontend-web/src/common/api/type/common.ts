import { NullableEq } from '@rinn7e/tea-cup-prelude'
import * as A from 'fp-ts/lib/Array'
import * as EqClass from 'fp-ts/lib/Eq'
import * as R from 'fp-ts/lib/Record'
import * as N from 'fp-ts/lib/number'
import * as S from 'fp-ts/lib/string'
import * as t from 'io-ts'

export type Errors = {
  errors: Record<string, string[]>
}

export const ErrorsJson = t.type({
  errors: t.record(t.string, t.array(t.string)),
})

export type HttpError<T> = {
  statusCode: number
  err: T | null
  actualErr: string
}

export const getHttpErrorEq = <T>(
  eq: EqClass.Eq<T>,
): EqClass.Eq<HttpError<T>> =>
  EqClass.struct({
    statusCode: N.Eq,
    err: NullableEq(eq),
    actualErr: S.Eq,
  })

export type HttpErrorString = HttpError<string>

export const HttpErrorStringEq: EqClass.Eq<HttpErrorString> = getHttpErrorEq(
  S.Eq,
)

export type ApiError = {
  errors: Record<string, string[]>
}

export const ApiErrorEq: EqClass.Eq<ApiError> = EqClass.struct({
  errors: R.getEq(A.getEq(S.Eq)),
})

export const ApiErrorJson = t.type({
  errors: t.record(t.string, t.array(t.string)),
})

export const mkHttpError = (
  statusCode: number,
  actualErr: string,
): HttpErrorString => ({
  statusCode,
  err: actualErr,
  actualErr,
})
