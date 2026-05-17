import * as A from 'fp-ts/lib/Array'
import * as EqClass from 'fp-ts/lib/Eq'
import * as S from 'fp-ts/lib/string'
import * as t from 'io-ts'

export type TagsResponse = {
  tags: string[]
}

export const TagsResponseEq = EqClass.struct<TagsResponse>({
  tags: A.getEq(S.Eq),
})

export const TagsResponseJson: t.Type<TagsResponse> = t.type({
  tags: t.array(t.string),
})
