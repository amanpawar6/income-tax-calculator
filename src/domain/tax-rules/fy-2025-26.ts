import type { TaxRulesConfig } from './types'

const OLD_SLABS = [
  { upTo: 250_000, rate: 0 },
  { upTo: 500_000, rate: 0.05 },
  { upTo: 1_000_000, rate: 0.2 },
  { upTo: null, rate: 0.3 },
]

const NEW_SLABS = [
  { upTo: 400_000, rate: 0 },
  { upTo: 800_000, rate: 0.05 },
  { upTo: 1_200_000, rate: 0.1 },
  { upTo: 1_600_000, rate: 0.15 },
  { upTo: 2_000_000, rate: 0.2 },
  { upTo: 2_400_000, rate: 0.25 },
  { upTo: null, rate: 0.3 },
]

const OLD_DEDUCTIONS = [
  'standardDeduction',
  'hra',
  'lta',
  'professionalTax',
  '80C',
  '80CCD1B',
  '80CCD2',
  '80D',
  '80E',
  '24b',
] as const

export const fy202526: TaxRulesConfig = {
  id: 'fy-2025-26',
  label: 'FY 2025-26 (AY 2026-27)',
  assessmentYear: '2026-27',
  defaultRegime: 'new',
  cessRate: 0.04,
  deductionCaps: {
    section80C: 150_000,
    section80CCD1B: 50_000,
    section24b: 200_000,
    section80D: { self: 25_000, parents: 50_000 },
  },
  oldRegime: {
    slabs: OLD_SLABS,
    standardDeductionSalaried: 50_000,
    section87A: { maxTaxableIncome: 500_000, maxRebate: 12_500 },
    allowedDeductions: [...OLD_DEDUCTIONS],
    employerNps80CCD2PercentOfBasic: 0.1,
  },
  newRegime: {
    slabs: NEW_SLABS,
    standardDeductionSalaried: 75_000,
    section87A: { maxTaxableIncome: 1_200_000, maxRebate: 60_000 },
    allowedDeductions: ['standardDeduction', '80CCD2'],
    employerNps80CCD2PercentOfBasic: 0.14,
  },
}
