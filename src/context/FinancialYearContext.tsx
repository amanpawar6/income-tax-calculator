import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  AVAILABLE_FINANCIAL_YEARS,
  DEFAULT_FY_ID,
  getTaxRules,
  type TaxRulesConfig,
} from '../domain/tax-rules'

type FinancialYearContextValue = {
  fyId: string
  setFyId: (id: string) => void
  rules: TaxRulesConfig
  availableYears: TaxRulesConfig[]
}

const FinancialYearContext = createContext<FinancialYearContextValue | null>(
  null,
)

export function FinancialYearProvider({ children }: { children: ReactNode }) {
  const [fyId, setFyId] = useState(DEFAULT_FY_ID)
  const rules = useMemo(() => getTaxRules(fyId), [fyId])

  const value = useMemo(
    () => ({
      fyId,
      setFyId,
      rules,
      availableYears: AVAILABLE_FINANCIAL_YEARS,
    }),
    [fyId, rules],
  )

  return (
    <FinancialYearContext.Provider value={value}>
      {children}
    </FinancialYearContext.Provider>
  )
}

export function useFinancialYear() {
  const ctx = useContext(FinancialYearContext)
  if (!ctx) {
    throw new Error('useFinancialYear must be used within FinancialYearProvider')
  }
  return ctx
}
