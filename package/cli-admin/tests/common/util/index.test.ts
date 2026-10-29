import { describe, expect, it } from 'vitest'

import { fit } from '@/common/util'

describe('fit', () => {
  it('pads a short text to the width', () => {
    expect(fit('ab', 4)).toBe('ab  ')
  })

  it('cuts a long text with an ellipsis', () => {
    expect(fit('abcdef', 4)).toBe('abc…')
  })
})
