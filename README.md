# India Income Tax Calculator

A client-side calculator for **salaried individuals** in India. Compare **old** vs **new** tax regime using configurable rules per financial year.

## Stack

- [Vite](https://vite.dev/) + React + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) v4
- [Vitest](https://vitest.dev/) for the tax engine

## Quick start

```bash
npm install
npm run dev
npm test
npm run build
```

## Salary & investments entry modes

- **Salary:** enter **annual totals** or a **month-wise grid** (Apr–Mar). Includes **taxable** and **non-taxable** rows (food coupons, phone/internet reimbursement, etc.).
- **Rent (HRA):** annual or month-wise; month-wise HRA exemption is summed per month.
- **Investments:** **item-wise** (PPF, ELSS, LIC, etc. with section hints) or **section totals** for quick entry.

## Supported financial years

| FY | Notes |
|----|--------|
| FY 2025-26 | Budget 2025 new-regime slabs; 87A up to ₹12L taxable |
| FY 2024-25 | Pre–Budget 2025 new-regime slabs; 87A up to ₹7L taxable |

Select the year in the app header. All slab rates, caps, and rebates come from `src/domain/tax-rules/fy-*.ts`.

## Adding a new financial year

1. Copy `src/domain/tax-rules/fy-2025-26.ts` to `fy-20XX-YY.ts`.
2. Update slabs, `deductionCaps`, `section87A`, and regime settings.
3. Register the config in `src/domain/tax-rules/index.ts`.
4. Add test fixtures if needed.

No engine changes are required unless a **new deduction type** is introduced.

## Project layout

```
src/
  domain/tax-rules/   # FY configs + registry
  engine/             # Pure tax calculation (no React)
  components/         # UI forms and results
  context/            # Selected financial year
```

## Simplifications (v1)

- LTA: user enters eligible exempt amount (not full travel rules).
- Section 80D: single combined field with a simplified cap.
- No surcharge, marginal relief, or senior-citizen slabs.
- Age assumed under 60.

## Disclaimer

This tool provides **estimates for learning**. Tax liability depends on many factors. Consult a chartered accountant or the [Income Tax portal](https://www.incometax.gov.in) before filing.
