import { describe, expect, it } from 'vitest'

import { getErrorMessages } from '@/component/error-messages/util'

describe('getErrorMessages', () => {
  it('turns every field error into a capitalised sentence', () => {
    expect(
      getErrorMessages({
        statusCode: 422,
        err: {
          errors: { email: ['is invalid'], password: ["can't be blank"] },
        },
        actualErr: '{}',
      }),
    ).toEqual(['Email is invalid.', "Password can't be blank."])
  })

  it('reports network failures as "Unable to connect"', () => {
    expect(
      getErrorMessages({
        statusCode: 0,
        err: null,
        actualErr: 'Failed to fetch',
      }),
    ).toEqual(['Unable to connect'])
    expect(
      getErrorMessages({
        statusCode: 0,
        err: null,
        actualErr: 'NetworkError when attempting to fetch resource.',
      }),
    ).toEqual(['Unable to connect'])
  })

  it('falls back to the raw error without an API error body', () => {
    expect(
      getErrorMessages({ statusCode: 500, err: null, actualErr: 'Boom' }),
    ).toEqual(['Boom'])
  })
})
