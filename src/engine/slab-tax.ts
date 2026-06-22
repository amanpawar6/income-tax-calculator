import type { Slab } from '../domain/tax-rules/types'

export function computeSlabTax(taxableIncome: number, slabs: Slab[]): number {
  if (taxableIncome <= 0) {
    return 0
  }

  let tax = 0
  let previousLimit = 0

  for (const slab of slabs) {
    const upper = slab.upTo ?? Number.POSITIVE_INFINITY
    if (taxableIncome <= previousLimit) {
      break
    }

    const incomeInSlab = Math.min(taxableIncome, upper) - previousLimit
    if (incomeInSlab > 0) {
      tax += incomeInSlab * slab.rate
    }

    previousLimit = upper
  }

  return Math.round(tax)
}
