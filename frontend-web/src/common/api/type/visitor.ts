import * as t from 'io-ts'

export type TrackVisitorRequest = {
  path: string
}

export const TrackVisitorRequestJson: t.Type<TrackVisitorRequest> = t.type({
  path: t.string,
})

export type VisitorResponse = {
  id: number
  ip: string
  userAgent: string
  path: string
  timestamp: string
}

export const VisitorResponseJson: t.Type<VisitorResponse> = t.type({
  id: t.number,
  ip: t.string,
  userAgent: t.string,
  path: t.string,
  timestamp: t.string,
})
