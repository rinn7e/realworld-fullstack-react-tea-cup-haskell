import * as t from 'io-ts'

export type TrackVisitorRequest = {
  path: string
}

export const TrackVisitorRequestJson: t.Type<TrackVisitorRequest> = t.type({
  path: t.string,
})
