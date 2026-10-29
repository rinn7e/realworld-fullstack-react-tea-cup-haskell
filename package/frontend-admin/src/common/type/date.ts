import * as t from 'io-ts'

export const DateJson: t.Type<Date, string, unknown> = new t.Type<
  Date,
  string,
  unknown
>(
  'Date',
  (u): u is Date => u instanceof Date,
  (u, c) => {
    if (typeof u === 'string') {
      const d = new Date(u)
      return Number.isNaN(d.getTime()) ? t.failure(u, c) : t.success(d)
    } else if (u instanceof Date) {
      return Number.isNaN(u.getTime()) ? t.failure(u, c) : t.success(u)
    } else {
      return t.failure(u, c)
    }
  },
  (a) => a.toISOString(),
)
