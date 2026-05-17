import * as EqClass from 'fp-ts/lib/Eq'
import * as N from 'fp-ts/lib/number'
import * as S from 'fp-ts/lib/string'
import * as t from 'io-ts'

export type Visitor = {
  id: number
  ip: string
  userAgent: string
  path: string
  timestamp: string
}

export const VisitorEq: EqClass.Eq<Visitor> = EqClass.struct({
  id: N.Eq,
  ip: S.Eq,
  userAgent: S.Eq,
  path: S.Eq,
  timestamp: S.Eq,
})

export const VisitorJson: t.Type<Visitor> = t.type({
  id: t.number,
  ip: t.string,
  userAgent: t.string,
  path: t.string,
  timestamp: t.string,
})

export type VisitorListResponse = {
  visitors: Visitor[]
  totalCount: number
}

export const VisitorListResponseJson = t.type({
  visitors: t.array(VisitorJson),
  totalCount: t.number,
})
