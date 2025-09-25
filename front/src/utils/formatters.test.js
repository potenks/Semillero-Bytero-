import { describe, it, expect } from 'vitest'
import { formatDate } from './formatters'

describe('formatDate', () => {
  it('formats ISO date to locale string', () => {
    const iso = '2024-01-15T12:34:56.000Z'
    const out = formatDate(iso)
    expect(typeof out).toBe('string')
    expect(out.length).toBeGreaterThan(5)
  })
})
