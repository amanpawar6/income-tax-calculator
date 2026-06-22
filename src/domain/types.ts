import {
  emptyInvestmentDetail,
  type InvestmentDetail,
} from './investment-catalog'
import { FY_MONTH_COUNT } from './fy-months'

export type TaxRegime = 'old' | 'new'
export type EntryMode = 'annual' | 'monthly'
export type InvestmentEntryMode = 'summary' | 'detailed'

export type SalaryComponents = {
  basic: number
  hraReceived: number
  specialAllowance: number
  ltaReceived: number
  bonus: number
  otherTaxableAllowances: number
  foodCoupons: number
  phoneInternet: number
  driverCarAllowance: number
  childrenEducationAllowance: number
  childrenHostelAllowance: number
  giftVouchers: number
  uniformAllowance: number
  booksPeriodicals: number
  otherNonTaxable: number
  employeePf: number
  professionalTax: number
  gratuity: number
}

export const emptySalaryComponents = (): SalaryComponents => ({
  basic: 0,
  hraReceived: 0,
  specialAllowance: 0,
  ltaReceived: 0,
  bonus: 0,
  otherTaxableAllowances: 0,
  foodCoupons: 0,
  phoneInternet: 0,
  driverCarAllowance: 0,
  childrenEducationAllowance: 0,
  childrenHostelAllowance: 0,
  giftVouchers: 0,
  uniformAllowance: 0,
  booksPeriodicals: 0,
  otherNonTaxable: 0,
  employeePf: 0,
  professionalTax: 0,
  gratuity: 0,
})

export function emptyMonthlySalary(): SalaryComponents[] {
  return Array.from({ length: FY_MONTH_COUNT }, () => emptySalaryComponents())
}

export type ExemptionInputs = {
  rentPaid: number
  monthlyRentPaid: number[]
  isMetro: boolean
  ltaExemptAmount: number
}

export type InvestmentDeductions = {
  section80C: number
  section80CCD1B: number
  employerNps: number
  section80D: number
  section80E: number
  section24b: number
  otherIncome: number
}

export type TaxInput = {
  salaryEntryMode: EntryMode
  salary: SalaryComponents
  monthlySalary: SalaryComponents[]
  rentEntryMode: EntryMode
  exemptions: ExemptionInputs
  investmentEntryMode: InvestmentEntryMode
  investments: InvestmentDeductions
  investmentDetail: InvestmentDetail
}

export const emptyTaxInput = (): TaxInput => ({
  salaryEntryMode: 'annual',
  salary: emptySalaryComponents(),
  monthlySalary: emptyMonthlySalary(),
  rentEntryMode: 'annual',
  exemptions: {
    rentPaid: 0,
    monthlyRentPaid: Array(12).fill(0),
    isMetro: false,
    ltaExemptAmount: 0,
  },
  investmentEntryMode: 'detailed',
  investments: {
    section80C: 0,
    section80CCD1B: 0,
    employerNps: 0,
    section80D: 0,
    section80E: 0,
    section24b: 0,
    otherIncome: 0,
  },
  investmentDetail: emptyInvestmentDetail(),
})

export type TaxResult = {
  regime: TaxRegime
  financialYearId: string
  ctc: number
  grossSalary: number
  nonTaxableAllowances: number
  exemptions: { hra: number; lta: number }
  deductions: Record<string, number>
  grossTotalIncome: number
  taxableIncome: number
  taxBeforeRebate: number
  rebate87A: number
  taxAfterRebate: number
  cess: number
  totalTax: number
  monthlyTds: number
  effectiveRate: number
}

export type RegimeComparison = {
  financialYearId: string
  old: TaxResult
  new: TaxResult
  recommended: TaxRegime
  savings: number
}
