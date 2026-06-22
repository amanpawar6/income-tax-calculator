import { describe, expect, it } from 'vitest'
import { TAX_RULES_REGISTRY } from '../../domain/tax-rules'
import { computeSlabTax } from '../slab-tax'

describe.each(Object.keys(TAX_RULES_REGISTRY))('computeSlabTax (%s)', (fyId) => {
  const rules = TAX_RULES_REGISTRY[fyId]

  it('returns 0 for zero income', () => {
    expect(computeSlabTax(0, rules.oldRegime.slabs)).toBe(0)
  })

  it('computes old regime tax for ₹10L taxable', () => {
    if (fyId !== 'fy-2025-26') return
    // 2.5L @0 + 2.5L @5% + 5L @20% = 0 + 12500 + 100000 = 112500
    expect(computeSlabTax(1_000_000, rules.oldRegime.slabs)).toBe(112_500)
  })

  it('computes new regime tax for ₹12L taxable (FY 2025-26)', () => {
    if (fyId !== 'fy-2025-26') return
    // 4L@0 + 4L@5% + 4L@10% = 0 + 20000 + 40000 = 60000
    expect(computeSlabTax(1_200_000, rules.newRegime.slabs)).toBe(60_000)
  })
})

describe('computeHraExemption', () => {
  it('returns minimum of three components', async () => {
    const { computeHraExemption } = await import('../hra-exemption')
    const exemption = computeHraExemption(
      500_000,
      200_000,
      180_000,
      true,
    )
    expect(exemption).toBe(130_000)
  })
})
