import { describe, expect, it } from 'vitest'
import { normalizeTaxInput } from '../../domain/normalize-input'
import { getTaxRules } from '../../domain/tax-rules'
import { compareRegimes } from '../compare-regimes'
import fixture from './fixtures/fy-2025-26.json'

describe('golden fixture — FY 2025-26', () => {
  const rules = getTaxRules('fy-2025-26')
  const input = normalizeTaxInput(
    fixture.input as Parameters<typeof normalizeTaxInput>[0],
  )

  it('matches expected regime comparison', () => {
    const result = compareRegimes(input, rules)
    expect(result.old.totalTax).toBe(fixture.expected.oldTotalTax)
    expect(result.new.totalTax).toBe(fixture.expected.newTotalTax)
    expect(result.recommended).toBe(fixture.expected.recommended)
  })
})
