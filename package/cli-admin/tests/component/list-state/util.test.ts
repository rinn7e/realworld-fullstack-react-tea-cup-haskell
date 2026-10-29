import { describe, expect, it } from 'vitest'

import { formatListError } from '@/component/list-state/util'

describe('formatListError', () => {
  it('joins every field error', () => {
    expect(
      formatListError({
        statusCode: 422,
        err: { errors: { search: ['is too long'], sort: ['bad', 'worse'] } },
        actualErr: '{}',
      }),
    ).toBe('search: is too long; sort: bad, worse')
  })

  it('shows the status and raw error without an API error body', () => {
    expect(
      formatListError({
        statusCode: 0,
        err: null,
        actualErr: 'Failed to fetch',
      }),
    ).toBe('Connection error (Status 0): Failed to fetch')
  })
})
