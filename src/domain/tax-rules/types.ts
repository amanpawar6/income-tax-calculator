export type DeductionKey =
  | 'standardDeduction'
  | 'hra'
  | 'lta'
  | 'professionalTax'
  | '80C'
  | '80CCD1B'
  | '80CCD2'
  | '80D'
  | '80E'
  | '24b'

export type Slab = {
  /** Upper limit of this bracket (inclusive). `null` = no upper limit. */
  upTo: number | null
  rate: number
}

export type Section87A = {
  maxTaxableIncome: number
  maxRebate: number
}

export type RegimeRules = {
  slabs: Slab[]
  standardDeductionSalaried: number
  section87A: Section87A | null
  allowedDeductions: DeductionKey[]
  employerNps80CCD2PercentOfBasic: number
}

export type TaxRulesConfig = {
  id: string
  label: string
  assessmentYear: string
  defaultRegime: 'new' | 'old'
  cessRate: number
  deductionCaps: {
    section80C: number
    section80CCD1B: number
    section24b: number
    section80D: { self: number; parents: number }
  }
  oldRegime: RegimeRules
  newRegime: RegimeRules
}
