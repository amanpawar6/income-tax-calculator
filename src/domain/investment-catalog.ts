/** Guided line items — amounts are annual (₹). */

export type InvestmentDetail = {
  section80C: {
    ppf: number
    elss: number
    lic: number
    homeLoanPrincipal: number
    nsc: number
    tuitionFees: number
    sukanyaSamriddhi: number
    fixedDeposit5Year: number
    other80C: number
  }
  section80CCD1B: { npsAdditional: number }
  section80CCD2: { employerNps: number }
  section80D: {
    selfFamily: number
    parents: number
    preventiveCheckup: number
  }
  section80E: { educationLoanInterest: number }
  section24b: { homeLoanInterest: number }
  otherIncome: {
    savingsInterest: number
    rentalIncome: number
    other: number
  }
}

export type InvestmentFieldDef = {
  key: string
  label: string
  hint?: string
}

export type InvestmentCategoryDef = {
  id: keyof InvestmentDetail
  title: string
  sectionLabel: string
  description: string
  fields: InvestmentFieldDef[]
}

export const INVESTMENT_CATEGORIES: InvestmentCategoryDef[] = [
  {
    id: 'section80C',
    title: 'Section 80C',
    sectionLabel: '80C',
    description:
      'PPF, ELSS, LIC, home loan principal, NSC, tuition fees, etc. Employee PF from salary is added automatically.',
    fields: [
      { key: 'ppf', label: 'PPF' },
      { key: 'elss', label: 'ELSS (tax-saving mutual funds)' },
      { key: 'lic', label: 'LIC premium' },
      {
        key: 'homeLoanPrincipal',
        label: 'Home loan principal repayment',
      },
      { key: 'nsc', label: 'NSC' },
      { key: 'tuitionFees', label: "Children's tuition fees" },
      { key: 'sukanyaSamriddhi', label: 'Sukanya Samriddhi' },
      { key: 'fixedDeposit5Year', label: '5-year tax-saving FD' },
      { key: 'other80C', label: 'Other 80C investments' },
    ],
  },
  {
    id: 'section80CCD1B',
    title: 'Section 80CCD(1B)',
    sectionLabel: '80CCD(1B)',
    description: 'Additional voluntary NPS contribution (over and above 80C).',
    fields: [
      { key: 'npsAdditional', label: 'Additional NPS (self)' },
    ],
  },
  {
    id: 'section80CCD2',
    title: 'Section 80CCD(2)',
    sectionLabel: '80CCD(2)',
    description: "Employer's NPS contribution (allowed in both regimes).",
    fields: [{ key: 'employerNps', label: 'Employer NPS contribution' }],
  },
  {
    id: 'section80D',
    title: 'Section 80D',
    sectionLabel: '80D',
    description: 'Health insurance premiums and preventive health check-up.',
    fields: [
      { key: 'selfFamily', label: 'Self & family premium' },
      { key: 'parents', label: 'Parents premium' },
      {
        key: 'preventiveCheckup',
        label: 'Preventive check-up',
        hint: 'Included within 80D limits',
      },
    ],
  },
  {
    id: 'section80E',
    title: 'Section 80E',
    sectionLabel: '80E',
    description: 'Interest on education loan (no upper cap in this calculator).',
    fields: [
      { key: 'educationLoanInterest', label: 'Education loan interest' },
    ],
  },
  {
    id: 'section24b',
    title: 'Section 24(b)',
    sectionLabel: '24(b)',
    description: 'Interest on home loan for self-occupied property (old regime).',
    fields: [{ key: 'homeLoanInterest', label: 'Home loan interest' }],
  },
  {
    id: 'otherIncome',
    title: 'Other income',
    sectionLabel: 'Other',
    description: 'Income added to gross total income (not a deduction).',
    fields: [
      { key: 'savingsInterest', label: 'Savings / FD interest' },
      { key: 'rentalIncome', label: 'Rental income' },
      { key: 'other', label: 'Any other taxable income' },
    ],
  },
]

export const emptyInvestmentDetail = (): InvestmentDetail => ({
  section80C: {
    ppf: 0,
    elss: 0,
    lic: 0,
    homeLoanPrincipal: 0,
    nsc: 0,
    tuitionFees: 0,
    sukanyaSamriddhi: 0,
    fixedDeposit5Year: 0,
    other80C: 0,
  },
  section80CCD1B: { npsAdditional: 0 },
  section80CCD2: { employerNps: 0 },
  section80D: { selfFamily: 0, parents: 0, preventiveCheckup: 0 },
  section80E: { educationLoanInterest: 0 },
  section24b: { homeLoanInterest: 0 },
  otherIncome: { savingsInterest: 0, rentalIncome: 0, other: 0 },
})

function sumRecord(values: Record<string, number>): number {
  return Object.values(values).reduce((a, b) => a + b, 0)
}

import type { InvestmentDeductions } from './types'

export function aggregateInvestmentDetail(
  detail: InvestmentDetail,
): InvestmentDeductions {
  return {
    section80C: sumRecord(detail.section80C),
    section80CCD1B: detail.section80CCD1B.npsAdditional,
    employerNps: detail.section80CCD2.employerNps,
    section80D: sumRecord(detail.section80D),
    section80E: detail.section80E.educationLoanInterest,
    section24b: detail.section24b.homeLoanInterest,
    otherIncome: sumRecord(detail.otherIncome),
  }
}
