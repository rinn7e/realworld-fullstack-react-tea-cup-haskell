import * as EqClass from 'fp-ts/lib/Eq'
import * as S from 'fp-ts/lib/string'
import * as t from 'io-ts'

export type Tag = {
  name: string
}

export const TagEq = EqClass.struct<Tag>({
  name: S.Eq,
})

export const TagJson: t.Type<Tag> = t.type({
  name: t.string,
})
