import { fy202425 } from './fy-2024-25'
import { fy202526 } from './fy-2025-26'
import type { TaxRulesConfig } from './types'

export type { TaxRulesConfig, Slab, RegimeRules, DeductionKey } from './types'

export const TAX_RULES_REGISTRY: Record<string, TaxRulesConfig> = {
  [fy202425.id]: fy202425,
  [fy202526.id]: fy202526,
}

export const DEFAULT_FY_ID = 'fy-2025-26'

export function getTaxRules(fyId: string): TaxRulesConfig {
  const rules = TAX_RULES_REGISTRY[fyId]
  if (!rules) {
    throw new Error(`Unknown financial year: ${fyId}`)
  }
  return rules
}

export const AVAILABLE_FINANCIAL_YEARS = Object.values(TAX_RULES_REGISTRY).sort(
  (a, b) => b.id.localeCompare(a.id),
)
